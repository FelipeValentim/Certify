using Domain.Constants;
using Domain.DTO;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using HeyRed.Mime;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Services.Helper;
using System.Diagnostics;
using System.Globalization;
using System.IO.Compression;
using System.IO.Pipes;
using System.Net;
using System.Text.RegularExpressions;
using Xceed.Document.NET;
using Xceed.Words.NET;

namespace Services
{
    public class EventService : IEventService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IGuestRepository _guestRepository;
        private readonly IEventTemplateRepository _eventTemplateRepository;
        private readonly IStorageService _storageService;
        private readonly IDocumentService _documentService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IMailService _mailService;
        private readonly IUserContextService _userContextService;
        private readonly IQRCodeService _qrCodeService;

        public EventService(IEventRepository eventRepository, IStorageService storageService, IDocumentService documentService, IWebHostEnvironment webHostEnvironment,
            IEventTemplateRepository eventTemplateRepository, IGuestRepository guestRepository, IMailService mailService, IUserContextService userContextService, IQRCodeService qrCodeService)
        {
            _eventRepository = eventRepository;
            _storageService = storageService;
            _documentService = documentService;
            _webHostEnvironment = webHostEnvironment;
            _eventTemplateRepository = eventTemplateRepository;
            _guestRepository = guestRepository;
            _mailService = mailService;
            _userContextService = userContextService;
            _qrCodeService = qrCodeService;
        }


        public FileDTO DownloadCertificates(Guid eventId)
        {
            var eventItem = _eventRepository.Get(x => x.Id == eventId, includeProperties: "EventTemplate, EventType");

            if (eventItem == null)
            {
                throw new NotFoundException("Evento não existe.");
            }

            if (eventItem.EventTemplate == null)
            {
                throw new NotFoundException("Evento não possui template.");
            }

            var guestItems = _guestRepository.GetAllRelated(x => x.EventId == eventId && x.CheckinDate.HasValue);

            if (guestItems.Count() == 0)
            {
                throw new NotFoundException("Evento não possui convidados com checkin.");
            }

            var eventTemplateItem = _eventTemplateRepository.GetByID(eventItem.EventTemplateId.Value);

            var templatePath = $"{UrlManager.Storage}{eventTemplateItem.Path}";

            // Criação do MemoryStream para armazenar o ZIP
            var zipMemoryStream = new MemoryStream();

            using (var zipArchive = new ZipArchive(zipMemoryStream, ZipArchiveMode.Create, true))
            {
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
                        options.SearchValue = "{Nome}";
                        options.NewValue = guest.Name;
                        document.ReplaceText(options);

                        options.SearchValue = "{Data}";
                        options.NewValue = eventItem.Date.ToBrazilDateInWords();
                        document.ReplaceText(options);

                        options.SearchValue = "{Tipo Convidado}";
                        options.NewValue = guest.GuestType.Name;
                        document.ReplaceText(options);

                        options.SearchValue = "{Evento}";
                        options.NewValue = eventItem.Name;
                        document.ReplaceText(options);

                        options.SearchValue = "{Horário Inicial}";
                        options.NewValue = eventItem.StartTime.ToString(@"hh\:mm");
                        document.ReplaceText(options);

                        options.SearchValue = "{Horário Final}";
                        options.NewValue = eventItem.EndTime.ToString(@"hh\:mm");
                        document.ReplaceText(options);

                        foreach (var fieldValue in guest.FieldsValues)
                        {
                            options.SearchValue = $"{{{fieldValue.EventField.Name}}}";
                            options.NewValue = fieldValue.Value;
                            document.ReplaceText(options);
                        }

                        MemoryStream documentStream = new MemoryStream();

                        document.SaveAs(documentStream);

                        // Passo 3: Converter o documento DOCX para PDF
                        var pdfStream = _documentService.ConvertDocumentToPdf(documentStream);

                        // Passo 4: Criar um arquivo dentro do ZIP para cada PDF
                        //var zipEntry = zipArchive.CreateEntry($"{guest.Name.RemoveWhiteSpace()}&{guest.Id}.pdf");
                        var zipEntry = zipArchive.CreateEntry($"{guest.Name.RemoveWhiteSpace()}.pdf");

                        zipEntry.LastWriteTime = DateTimeOffset.Now;

                        using (var zipStream = zipEntry.Open())
                        {
                            // Escrever o conteúdo do PDF no arquivo ZIP
                            pdfStream.CopyTo(zipStream);
                        }
                    }
                }
            }


            // Passo 5: Finalizar o arquivo ZIP
            zipMemoryStream.Seek(0, SeekOrigin.Begin);

            var bytes = zipMemoryStream.ToArray();

            string base64 = Convert.ToBase64String(bytes);

            var mimeType = "application/zip";

            var file = new FileDTO()
            {
                Base64 = base64,
                MimeType = mimeType,
                Name = $"cert_{eventItem.Name.RemoveWhiteSpace()}_{DateTime.UtcNow.ConvertToBrazilTime().ToString("yyyyMMdd_HHmmss")}.{MimeTypesMap.GetExtension(mimeType)}"
            };

            // Passo 6: Retornar o arquivo ZIP como resposta
            return file;
        }

        public void SendCertificates(Guid eventId)
        {
            var eventItem = _eventRepository.Get(x => x.Id == eventId, includeProperties: "EventTemplate, EventType");

            if (eventItem == null)
            {
                throw new NotFoundException("Evento não existe.");
            }

            if (eventItem.EventTemplate == null)
            {
                throw new NotFoundException("Evento não possui template.");
            }

            var guestItems = _guestRepository.GetAllRelated(x => x.EventId == eventId && x.CheckinDate.HasValue);

            if (guestItems.Count() == 0)
            {
                throw new NotFoundException("Evento não possui convidados com checkin.");
            }

            var eventTemplateItem = _eventTemplateRepository.GetByID(eventItem.EventTemplateId.Value);

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
                    options.SearchValue = "{Nome}";
                    options.NewValue = guest.Name;
                    document.ReplaceText(options);

                    options.SearchValue = "{Data}";
                    options.NewValue = eventItem.Date.ToBrazilDateInWords();
                    document.ReplaceText(options);

                    options.SearchValue = "{Tipo Convidado}";
                    options.NewValue = guest.GuestType.Name;
                    document.ReplaceText(options);

                    options.SearchValue = "{Evento}";
                    options.NewValue = eventItem.Name;
                    document.ReplaceText(options);

                    options.SearchValue = "{Horário Inicial}";
                    options.NewValue = eventItem.StartTime.ToString(@"hh\:mm");
                    document.ReplaceText(options);

                    options.SearchValue = "{Horário Final}";
                    options.NewValue = eventItem.EndTime.ToString(@"hh\:mm");
                    document.ReplaceText(options);

                    foreach (var fieldValue in guest.FieldsValues)
                    {
                        options.SearchValue = $"{{{fieldValue.EventField.Name}}}";
                        options.NewValue = fieldValue.Value;
                        document.ReplaceText(options);
                    }

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

            _mailService.SendMailCheckfyAsync(mailMessages).GetAwaiter().GetResult();
        }

        public Event Get(Guid id)
        {
            return _eventRepository.GetByID(id);
        }

        public Event GetRelatedFields(Guid id)
        {
            return _eventRepository.Get(x => x.Id == id, includeProperties: "Fields");
        }

        public Event GetRelated(Guid id)
        {
            var eventItem = _eventRepository.Get(x => x.Id == id, includeProperties: "EventTemplate, EventType");

            var guests = _guestRepository.GetGuests(eventItem.Id);

            eventItem.Guests = guests;

            return eventItem;
        }

        public int CountGuests(Guid eventId)
        {
            return _guestRepository.Count(x => x.EventId == eventId);
        }

        public object Add(EventDTO model)
        {

            var userId = _userContextService.UserGuid;

            if (string.IsNullOrEmpty(model.Name))
            {
                throw new BusinessException("Nome é obrigatório.");
            }

            if (DateTime.UtcNow.ConvertToBrazilTime() > model.Date.Date.Add(model.StartTime))
            {
                throw new BusinessException("A data e horário inicial já passaram.");
            }

            if (model.StartTime >= model.EndTime)
            {
                throw new BusinessException("Horário inicial não pode ser maior que horário final.");
            }

            if (model.Pax.HasValue && model.Pax.Value <= 0)
            {
                throw new BusinessException("Convidados precisa ser maior que 0.");
            }

            if (model.EventTypeId == Guid.Empty)
            {
                throw new BusinessException("Tipo de evento é obrigatório.");
            }

            Event newEvent = new Event
            {
                Date = model.Date.Date,
                StartTime = model.StartTime,
                EndTime = model.EndTime,
                Pax = model.Pax,
                Name = model.Name,
                EventTypeId = model.EventTypeId,
                UserId = userId,
            };

            if (model.PhotoFile != null)
            {
                model.PhotoFile.Path = $"{newEvent.Id}";

                newEvent.Photo = _storageService.UploadFile(model.PhotoFile).GetAwaiter().GetResult();
            }

            _eventRepository.Insert(newEvent);

            return new { id = newEvent.Id, photoFullUrl = $"{UrlManager.Storage}{newEvent.Photo}" };
        }

        public IEnumerable<Event> GetEvents()
        {
            var userId = _userContextService.UserGuid;

            return _eventRepository.GetEvents(userId);
        }

        public void Delete(Guid eventId)
        {
            _eventRepository.Delete(eventId);
        }

        public FileDTO GenerateCheckinQRCode(Guid eventId)
        {
            var url = $"{UrlManager.API}/form/checkin/{HasherId.Encode(eventId, Salt.Salt2)}";

            var response = _qrCodeService.GenerateQRCode(url);

            return response;
        }

        public Event GetByDecodedId(string id)
        {
            var guid = new Guid(id);

            if (guid == Guid.Empty)
            {
                throw new NotFoundException("Evento não encontrado");
            }

            var e = Get(guid);

            if (e == null)
            {
                throw new NotFoundException("Evento não encontrado");
            }

            return e;
        }

        public void CheckinEnabledMode(EventDTO model)
        {
            var eventItem = _eventRepository.Get(x => x.Id == model.Id);

            if (eventItem == null)
            {
                throw new NotFoundException("Evento não encontrado");
            }

            eventItem.CheckinEnabled = model.CheckinEnabled;

            _eventRepository.Update(eventItem);
        }
    }
}
