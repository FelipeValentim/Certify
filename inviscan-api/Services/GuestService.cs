using Domain.Constants;
using Domain.DTO;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Services.Helper;
using Spire.Doc;
using System;
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


        public GuestService(IGuestRepository guestRepository, IEventService eventService, IStorageService storageService, IGuestTypeService guestTypeService,
            IWebHostEnvironment webHostEnvironment, IMailService mailService, IQRCodeService qrCodeService)
        {
            _guestRepository = guestRepository;
            _eventService = eventService;
            _storageService = storageService;
            _guestTypeService = guestTypeService;
            _webHostEnvironment = webHostEnvironment;
            _mailService = mailService;
            _qrCodeService = qrCodeService;
        }

        public ResponseModel<object> Add(GuestDTO model)
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

                //if (DateTime.Now > eventItem.Date.Add(eventItem.EndTime)) // Já passou o horário final do evento
                //{
                //	return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Não é permitido adicionar mais convidados (evento finalizado).");
                //}

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
                    guest.Photo = _storageService.UploadFile(model.PhotoFile, $"{guest.EventId}/{guest.Id}");
                }

                // Inserir o convidado no repositório
                _guestRepository.Insert(guest);

                SendQRCode(guest.EventId, guest.Id);

                // Retornar resposta de sucesso
                return ResponseModel<object>.Success(new { id = guest.Id, photoFullUrl = $"{Default.URL}{guest.Photo}" }, HttpStatusCode.OK);
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
                var qrCodeBytes = _qrCodeService.GenerateQRCode(guest.Id);

                var mailMessage = new MailMessageDTO();

                mailMessage.AddTo(guest.Email, guest.Name);

                mailMessage.Subject = $"Convite - {eventItem.Name}";

                var html = htmlTemplate.Replace("{convidado}", guest.Name);

                mailMessage.Html = html;

                mailMessage.AddEmbedded(qrCodeBytes, "image/png", "Convite - QRCode", "{qrcode}");

                _mailService.SendMailCheckfy(mailMessage);
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
    }
}
