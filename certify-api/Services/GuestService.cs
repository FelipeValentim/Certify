using Domain.Constants;
using Domain.DTO;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;
using Services.Helper;
using System.Globalization;
using System.Net;
using System.Text.RegularExpressions;
using Xceed.Document.NET;
using Xceed.Words.NET;

namespace Services
{
    public class GuestService : IGuestService
    {
        private readonly IGuestRepository _guestRepository;
        private readonly IEventService _eventService;
        private readonly IEventTemplateService _eventTemplateService;
        private readonly IStorageService _storageService;
        private readonly IGuestTypeService _guestTypeService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IQRCodeService _qrCodeService;
        private readonly IMailService _mailService;
        private readonly IMappingService _mappingService;
        private readonly IImageManager _imageManager;
        private readonly IDocumentService _documentService;

        public GuestService(IGuestRepository guestRepository, IEventService eventService, IEventTemplateService eventTemplateService, IStorageService storageService, IGuestTypeService guestTypeService,
            IWebHostEnvironment webHostEnvironment, IMailService mailService, IQRCodeService qrCodeService, IMappingService mappingService, IImageManager imageManager, IDocumentService documentService)
        {
            _guestRepository = guestRepository;
            _eventService = eventService;
            _eventTemplateService = eventTemplateService;
            _storageService = storageService;
            _guestTypeService = guestTypeService;
            _webHostEnvironment = webHostEnvironment;
            _mailService = mailService;
            _qrCodeService = qrCodeService;
            _mappingService = mappingService;
            _imageManager = imageManager;
            _documentService = documentService;
        }

        public object Add(GuestDTO model, bool form = false)
        {
            // Validação dos campos obrigatórios
            if (string.IsNullOrEmpty(model.Name))
            {
                throw new BusinessException("Nome é obrigatório.");
            }

            if (string.IsNullOrEmpty(model.Email))
            {
                throw new BusinessException("Email é obrigatório.");
            }

            string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

            if (!Regex.IsMatch(model.Email, pattern))
            {
                throw new BusinessException("Email inválido.");
            }

            if (model.GuestTypeId == Guid.Empty)
            {
                throw new BusinessException("Tipo de Convidado é obrigatório.");
            }

            var eventItem = _eventService.Get(model.EventId);

            if (eventItem == null)
            {
                throw new BusinessException("Evento é obrigatório.");
            }

            if (form)
            {
                if (DateTime.UtcNow.ConvertToBrazilTime() > eventItem.Date.Add(eventItem.StartTime)) // Já passou o horário inicial do evento
                {
                    throw new BusinessException("Prazo de cadastro para o evento finalizado.");
                }
            }

            if (eventItem.Pax.HasValue) // Tem limite de convidados
            {
                if (_eventService.CountGuests(eventItem.Id) >= eventItem.Pax)
                {
                    throw new BusinessException("Limite de convidados atingido para este evento.");
                }
            }

            // Verificar se o email já está cadastrado para o evento
            if (_guestRepository.Exists(model.EventId, model.Email))
            {
                throw new BusinessException("Email já cadastrado para este evento.");
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

                model.PhotoFile.Path = $"{guest.EventId}/{guest.Id}";

                guest.Photo = _storageService.UploadFile(model.PhotoFile).GetAwaiter().GetResult();
            }

            // Inserir o convidado no repositório
            _guestRepository.Insert(guest);

            SendInvitation(guest.EventId, guest.Id);

            // Retornar resposta de sucesso
            return new { id = guest.Id, photoFullUrl = $"{UrlManager.Storage}{guest.Photo}" };

        }

        public void SendInvitation(Guid eventId, Guid id)
        {
            SendInvitations(eventId, new Guid[] { id });
        }


        public void SendInvitations(Guid eventId, Guid[] ids)
        {
            var eventItem = _eventService.Get(eventId);

            string htmlPath = Path.Combine(_webHostEnvironment.WebRootPath, "html", "qrcode.html");

            string htmlTemplate = File.ReadAllText(htmlPath);

            htmlTemplate = htmlTemplate.Replace("{evento}", eventItem.Name)
                                       .Replace("{data}", eventItem.Date.ToBrazilDateInWords())
                                       .Replace("{horarioinicial}", eventItem.StartTime.ToString(@"hh\:mm"))
                                       .Replace("{horariofinal}", eventItem.EndTime.ToString(@"hh\:mm"));



            var guests = _guestRepository.GetAll(u => ids.Contains(u.Id) && !u.CheckinDate.HasValue);

            foreach (var guest in guests)
            {
                //var qrCode = _qrCodeService.GenerateQRCode(guest.Id);

                var mailMessage = new MailMessageDTO();

                mailMessage.AddTo(guest.Email, guest.Name);

                mailMessage.Subject = $"Convite - {eventItem.Name}";

                var encodedId = HasherId.Encode(guest.Id, Salt.GuestGUID);

                var html = htmlTemplate.Replace("{convidado}", guest.Name)
                                       .Replace("{accesscode}", encodedId)
                                       .Replace("{qrcode}", $"{UrlManager.API}/Guest/QRCode/{encodedId}");

                mailMessage.Html = html;

                //mailMessage.AddEmbedded(qrCode.Data, qrCode.MimeType, "Convite - QRCode", "{qrcode}");

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


        public string Checkin(Guid id, bool form = false)
        {
            var guest = _guestRepository.GetByID(id);

            if (guest == null)
            {
                throw new NotFoundException("Convidado não existe.");
            }

            if (guest.CheckinDate.HasValue)
            {
                throw new ConflictException("Já foi realizado checkin para este convidado.");
            }

            if (form)
            {
                var eventItem = _eventService.Get(guest.EventId);

                if (eventItem.CheckinEnabled == false)
                {
                    throw new BusinessException("Checkin está desativado.");
                }

                if (eventItem.CheckinEnabled == null)
                {
                    if (DateTime.UtcNow.ConvertToBrazilTime() < eventItem.Date.Add(eventItem.StartTime))
                    {
                        throw new BusinessException("Evento ainda não começou.");
                    }

                    if (DateTime.UtcNow.ConvertToBrazilTime() > eventItem.Date.Add(eventItem.EndTime))
                    {
                        throw new BusinessException("Evento já finalizado.");
                    }
                }
            }

            guest.CheckinDate = DateTime.UtcNow.ConvertToBrazilTime();

            _guestRepository.Update(guest);

            return "Checkin realizado com sucesso.";
        }

        public string Checkin(string id, bool form = false)
        {
            var guid = new Guid(id);

            return Checkin(guid, form);
        }

        public string Checkin(Guid[] ids)
        {

            var guests = _guestRepository.GetAll(x => ids.Any(id => x.Id == id));

            foreach (var guest in guests)
            {
                guest.CheckinDate = DateTime.UtcNow.ConvertToBrazilTime();

                _guestRepository.Update(guest);
            }

            return "Checkin realizado com sucesso.";
        }

        public string Delete(Guid id)
        {
            _guestRepository.Delete(id);

            return "Checkin realizado com sucesso.";
        }

        public string Delete(Guid[] ids)
        {
            _guestRepository.Delete(ids);

            return "Checkin realizado com sucesso.";
        }

        public string Uncheckin(Guid id)
        {

            var guest = _guestRepository.GetByID(id);

            if (guest == null)
            {
                throw new NotFoundException("Convidado não existe.");
            }

            if (!guest.CheckinDate.HasValue)
            {
                throw new ConflictException("Já foi desfeito o checkin para este convidado.");
            }

            guest.CheckinDate = null;

            _guestRepository.Update(guest);

            return "Checkin desfeito com sucesso.";
        }

        public string Uncheckin(Guid[] ids)
        {

            var guests = _guestRepository.GetAll(x => ids.Any(id => x.Id == id));

            foreach (var guest in guests)
            {
                guest.CheckinDate = null;

                _guestRepository.Update(guest);
            }

            return "Checkin desfeito com sucesso.";

        }

        public GuestDTO Get(Guid id)
        {
            var guest = _guestRepository.GetByID(id);

            if (guest == null)
            {
                throw new BusinessException("Convidado não existe.");
            }

            var dto = _mappingService.Map<GuestDTO>(guest);

            return dto;
        }

        public GuestDTO Get(string id)
        {
            var guid = new Guid(id);

            return Get(guid);
        }

        public FileDTO GenerateCheckinQRCode(string guestId)
        {
            var response = _qrCodeService.GenerateQRCode(guestId);

            return response;
        }

        public void SendCertificates(Guid eventId, Guid[] ids)
        {
            var eventItem = _eventService.GetRelated(eventId);

            if (eventItem == null)
            {
                throw new NotFoundException("Evento não existe.");
            }

            if (eventItem.EventTemplate == null)
            {
                throw new NotFoundException("Evento não possui template.");
            }

            var guestItems = _guestRepository.GetAll(x => ids.Contains(x.Id) && x.EventId == eventId && x.CheckinDate.HasValue, includeProperties: "GuestType");

            var eventTemplateItem = _eventTemplateService.Get(eventItem.EventTemplateId.Value);

            var templatePath = $"{UrlManager.Storage}{eventTemplateItem.Path}";

            // Criação do MemoryStream para armazenar o ZIP

            string htmlPath = Path.Combine(_webHostEnvironment.WebRootPath, "html", "grateful.html");

            string htmlTemplate = File.ReadAllText(htmlPath);

            htmlTemplate = htmlTemplate.Replace("{evento}", eventItem.Name);

            List<MailMessageDTO> mailMessages = new List<MailMessageDTO>();

            foreach (var guest in guestItems)
            {
                // Passo 1: Carregar o template DOCX
                using (DocX document = DocX.Load(templatePath))
                {
                    var options = new StringReplaceTextOptions
                    {
                        TrackChanges = false,
                        RegExOptions = RegexOptions.None,
                        NewFormatting = null,
                        FormattingToMatch = null,
                        FormattingToMatchOptions = MatchFormattingOptions.SubsetMatch,
                        EscapeRegEx = true,
                        UseRegExSubstitutions = false,
                        RemoveEmptyParagraph = true
                    };

                    // Passo 2: Substituir o placeholder {{nome}} pelo nome do convidado
                    options.SearchValue = "{nome}";
                    options.NewValue = guest.Name;
                    document.ReplaceText(options);

                    options.SearchValue = "{data}";
                    options.NewValue = eventItem.Date.ToBrazilDateInWords();
                    document.ReplaceText(options);

                    options.SearchValue = "{tipoconvidado}";
                    options.NewValue = guest.GuestType.Name;
                    document.ReplaceText(options);

                    options.SearchValue = "{evento}";
                    options.NewValue = eventItem.Name;
                    document.ReplaceText(options);

                    options.SearchValue = "{horarioinicial}";
                    options.NewValue = eventItem.StartTime.ToString(@"hh\:mm");
                    document.ReplaceText(options);

                    options.SearchValue = "{horariofinal}";
                    options.NewValue = eventItem.EndTime.ToString(@"hh\:mm");
                    document.ReplaceText(options);

                    MemoryStream documentStream = new MemoryStream();

                    document.SaveAs(documentStream);

                    // Passo 3: Converter o documento DOCX para PDF
                    var pdfStream = _documentService.ConvertDocumentToPdf(documentStream);

                    var mailMessage = new MailMessageDTO();

                    mailMessage.AddTo(guest.Email, guest.Name);
                    mailMessage.Subject = $"Certificado - {eventItem.Name}";

                    mailMessage.AddAttachment(pdfStream, "application/pdf", $"{eventItem.Name.ReplaceWhiteSpace("_")}.pdf");

                    mailMessage.Html = htmlTemplate;

                    mailMessages.Add(mailMessage);
                }
            }

            _mailService.SendMailCheckfyAsync(mailMessages);


        }
    }
}
