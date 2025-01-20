using Domain.Constants;
using Domain.DTO;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Hosting;
using Services.Helper;
using System.Net;
using System.Text.RegularExpressions;

namespace Services
{
    public class GuestService : IGuestService
    {
        private readonly IGuestRepository _guestRepository;
        private readonly IEventService _eventService;
        private readonly IStorageService _storageService;
        private readonly IGuestTypeService _guestTypeService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IQRCodeService _qrCodeService;
        private readonly IMailService _mailService;
        private readonly IMappingService _mappingService;
        private readonly IImageManager _imageManager;

        public GuestService(IGuestRepository guestRepository, IEventService eventService, IStorageService storageService, IGuestTypeService guestTypeService,
            IWebHostEnvironment webHostEnvironment, IMailService mailService, IQRCodeService qrCodeService, IMappingService mappingService, IImageManager imageManager)
        {
            _guestRepository = guestRepository;
            _eventService = eventService;
            _storageService = storageService;
            _guestTypeService = guestTypeService;
            _webHostEnvironment = webHostEnvironment;
            _mailService = mailService;
            _qrCodeService = qrCodeService;
            _mappingService = mappingService;
            _imageManager = imageManager;
        }

        public ResponseModel<object> Add(GuestDTO model, bool form = false)
        {
            try
            {
                // Validação dos campos obrigatórios
                if (string.IsNullOrEmpty(model.Name))
                {
                    return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Nome é obrigatório.");
                }

                if (string.IsNullOrEmpty(model.Email))
                {
                    return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Email é obrigatório.");
                }

                string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

                if (!Regex.IsMatch(model.Email, pattern))
                {
                    return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Email inválido.");
                }

                if (model.GuestTypeId == Guid.Empty)
                {
                    return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Tipo de Convidado é obrigatório.");
                }

                var eventItem = _eventService.Get(model.EventId);

                if (eventItem == null)
                {
                    return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Evento é obrigatório.");
                }

                if (form)
                {
                    if (DateTime.Now > eventItem.Date.Add(eventItem.StartTime)) // Já passou o horário inicial do evento
                    {
                        return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Prazo de cadastro para o evento finalizado.");
                    }
                }

                if (eventItem.Pax.HasValue) // Tem limite de convidados
                {
                    if (_eventService.CountGuests(eventItem.Id) >= eventItem.Pax)
                    {
                        return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Limite de convidados atingido para este evento.");
                    }
                }

                // Verificar se o email já está cadastrado para o evento
                if (_guestRepository.Exists(model.EventId, model.Email))
                {
                    return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Email já cadastrado para este evento.");
                }

                // Criar entidade Guest
                var guest = new Guest
                {
                    Name = model.Name.Trim(),
                    Email = model.Email,
                    EventId = model.EventId,
                    GuestTypeId = model.GuestTypeId
                };

                // Upload da foto, se necessário
                if (model.PhotoFile != null)
                {
                    model.PhotoFile = _imageManager.CompressImage(model.PhotoFile);

                    guest.Photo = _storageService.UploadFile(model.PhotoFile, $"{guest.EventId}/{guest.Id}").GetAwaiter().GetResult();
                }

                // Inserir o convidado no repositório
                _guestRepository.Insert(guest);

                SendQRCode(guest.EventId, guest.Id);

                // Retornar resposta de sucesso
                return ResponseModel<object>.Success(new { id = guest.Id, photoFullUrl = $"{UrlManager.Storage}{guest.Photo}" }, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                // Retornar erro genérico em caso de exceção
                return ResponseModel<object>.Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        public void SendQRCode(Guid eventId, Guid id)
        {
            SendQRCode(eventId, new Guid[] { id });
        }


        public void SendQRCode(Guid eventId, Guid[] ids)
        {
            var eventItem = _eventService.Get(eventId);

            string htmlPath = Path.Combine(_webHostEnvironment.WebRootPath, "html", "qrcode.html");

            string htmlTemplate = File.ReadAllText(htmlPath);

            htmlTemplate = htmlTemplate.Replace("{evento}", eventItem.Name)
                                       .Replace("{data}", eventItem.Date.ToString("d 'de' MMMM 'de' yyyy"))
                                       .Replace("{horarioinicial}", eventItem.StartTime.ToString(@"hh\:mm"))
                                       .Replace("{horariofinal}", eventItem.EndTime.ToString(@"hh\:mm"));



            var guests = _guestRepository.GetAll(u => ids.Contains(u.Id));

            foreach (var guest in guests)
            {
                var qrCode = _qrCodeService.GenerateQRCode(guest.Id);

                var mailMessage = new MailMessageDTO();

                mailMessage.AddTo(guest.Email, guest.Name);

                mailMessage.Subject = $"Convite - {eventItem.Name}";

                var html = htmlTemplate.Replace("{convidado}", guest.Name)
                                       .Replace("{accesscode}", HasherId.Encode(guest.Id, Salt.GuestGUID));

                mailMessage.Html = html;

                mailMessage.AddEmbedded(qrCode.Data, qrCode.MimeType, "Convite - QRCode", "{qrcode}");

                _mailService.SendMailCheckfyAsync(mailMessage);
            }
        }


        public void SetStudentGuestType(ref GuestDTO guest)
        {
            var guestType = _guestTypeService.GetGuestTypeById(new Guid("569708F0-5263-4C29-A884-8EC882084715"));

            if (guestType != null)
            {
                guest.GuestTypeId = guestType.Id;
            }
            else
            {
                throw new Exception("Não existe GuestType com esse ID.");
            }
        }


        public ResponseModel Checkin(Guid id, bool form = false)
        {
            try
            {
                var guest = _guestRepository.GetByID(id);

                if (guest == null)
                {
                    return ResponseModel.Error(HttpStatusCode.BadRequest, "Convidado não existe.");
                }

                if (guest.CheckinDate.HasValue)
                {
                    return ResponseModel.Error(HttpStatusCode.Conflict, "Já foi realizado checkin para este convidado.");
                }

                if (form)
                {
                    var eventItem = _eventService.Get(guest.EventId);

                    if (DateTime.Now < eventItem.Date.Add(eventItem.StartTime))
                    {
                        return ResponseModel.Error(HttpStatusCode.BadRequest, "Evento ainda não começou.");
                    }

                    if (DateTime.Now > eventItem.Date.Add(eventItem.EndTime))
                    {
                        return ResponseModel.Error(HttpStatusCode.BadRequest, "Evento já finalizado.");
                    }
                }

                guest.CheckinDate = DateTime.Now;

                _guestRepository.Update(guest);

                return ResponseModel.Success("Checkin realizado com sucesso.");
            }
            catch (Exception ex)
            {
                return ResponseModel.Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        public ResponseModel Checkin(string id, bool form = false)
        {
            var guid = new Guid(id);

            return Checkin(guid, form);
        }

        public ResponseModel Checkin(Guid[] ids)
        {
            try
            {
                var guests = _guestRepository.GetAll(x => ids.Any(id => x.Id == id));

                foreach (var guest in guests)
                {
                    guest.CheckinDate = DateTime.Now;

                    _guestRepository.Update(guest);
                }

                return ResponseModel.Success("Checkin realizado com sucesso.");
            }
            catch (Exception ex)
            {
                return ResponseModel.Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        public ResponseModel Delete(Guid id)
        {
            try
            {
                _guestRepository.Delete(id);

                return ResponseModel.Success("Checkin realizado com sucesso.");
            }
            catch (Exception ex)
            {
                return ResponseModel.Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        public ResponseModel Delete(Guid[] ids)
        {
            try
            {
                _guestRepository.Delete(ids);

                return ResponseModel.Success("Checkin realizado com sucesso.");
            }
            catch (Exception ex)
            {
                return ResponseModel.Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        public ResponseModel Uncheckin(Guid id)
        {
            try
            {
                var guest = _guestRepository.GetByID(id);

                if (guest == null)
                {
                    return ResponseModel.Error(HttpStatusCode.BadRequest, "Convidado não existe.");
                }

                if (!guest.CheckinDate.HasValue)
                {
                    return ResponseModel.Error(HttpStatusCode.Conflict, "Já foi desfeito o checkin para este convidado.");
                }

                guest.CheckinDate = null;

                _guestRepository.Update(guest);

                return ResponseModel.Success("Checkin desfeito com sucesso.");
            }
            catch (Exception ex)
            {
                return ResponseModel.Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        public ResponseModel Uncheckin(Guid[] ids)
        {
            try
            {
                var guests = _guestRepository.GetAll(x => ids.Any(id => x.Id == id));

                foreach (var guest in guests)
                {
                    guest.CheckinDate = null;

                    _guestRepository.Update(guest);
                }

                return ResponseModel.Success("Checkin desfeito com sucesso.");
            }
            catch (Exception ex)
            {
                return ResponseModel.Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        public ResponseModel<GuestDTO> Get(Guid id)
        {
            var guest = _guestRepository.GetByID(id);

            if (guest == null)
            {
                return ResponseModel<GuestDTO>.Error(HttpStatusCode.BadRequest, "Convidado não existe.");
            }

            var dto = _mappingService.Map<GuestDTO>(guest);

            return ResponseModel<GuestDTO>.Success(dto);
        }

        public ResponseModel<GuestDTO> Get(string id)
        {
            var guid = new Guid(id);

            return Get(guid);
        }
    }
}
