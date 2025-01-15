﻿using Domain.Constants;
using Domain.DTO;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using HeyRed.Mime;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Services.Helper;
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

        public EventService(IEventRepository eventRepository, IStorageService storageService, IDocumentService documentService, IWebHostEnvironment webHostEnvironment,
            IEventTemplateRepository eventTemplateRepository, IGuestRepository guestRepository, IMailService mailService, IUserContextService userContextService)
        {
            _eventRepository = eventRepository;
            _storageService = storageService;
            _documentService = documentService;
            _webHostEnvironment = webHostEnvironment;
            _eventTemplateRepository = eventTemplateRepository;
            _guestRepository = guestRepository;
            _mailService = mailService;
            _userContextService = userContextService;
        }

        private string GeneratePreviewPath(Guid eventId)
        {
            var relativePath = $"/storage/{eventId}/preview.pdf";

            return relativePath;
        }

        public ResponseModel<FileDTO> DownloadCertificates(Guid eventId)
        {
            var eventItem = _eventRepository.Get(x => x.Id == eventId, includeProperties: "EventTemplate, EventType");

            if (eventItem == null)
            {
                return ResponseModel<FileDTO>.Error(HttpStatusCode.NotFound, "Evento não existe.");
            }

            if (eventItem.EventTemplate == null)
            {
                return ResponseModel<FileDTO>.Error(HttpStatusCode.NotFound, "Evento não possui template.");
            }

            var guestItems = _guestRepository.GetAll(x => x.EventId == eventId && x.CheckinDate.HasValue, includeProperties: "GuestType");
            var eventTemplateItem = _eventTemplateRepository.GetByID(eventItem.EventTemplateId.Value);

            string templatePath = Path.Combine(_webHostEnvironment.WebRootPath, eventTemplateItem.Path.TrimStart('/'));

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
                        options.SearchValue = "{nome}";
                        options.NewValue = guest.Name;
                        document.ReplaceText(options);

                        options.SearchValue = "{data}";
                        options.NewValue = eventItem.Date.ToString("d 'de' MMMM 'de' yyyy");
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
                Name = $"cert_{eventItem.Name.RemoveWhiteSpace()}_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.{MimeTypesMap.GetExtension(mimeType)}"
            };

            // Passo 6: Retornar o arquivo ZIP como resposta
            return ResponseModel<FileDTO>.Success(file);
        }

        public ResponseModel SendCertificates(Guid eventId)
        {
            var eventItem = _eventRepository.Get(x => x.Id == eventId, includeProperties: "EventTemplate, EventType");

            if (eventItem == null)
            {
                return ResponseModel.Error(HttpStatusCode.NotFound, "Evento não existe.");
            }

            if (eventItem.EventTemplate == null)
            {
                return ResponseModel.Error(HttpStatusCode.NotFound, "Evento não possui template.");
            }

            var guestItems = _guestRepository.GetAll(x => x.EventId == eventId && x.CheckinDate.HasValue, includeProperties: "GuestType");
            var eventTemplateItem = _eventTemplateRepository.GetByID(eventItem.EventTemplateId.Value);

            string templatePath = Path.Combine(_webHostEnvironment.WebRootPath, eventTemplateItem.Path.TrimStart('/'));

            // Criação do MemoryStream para armazenar o ZIP

            string htmlPath = Path.Combine(_webHostEnvironment.WebRootPath, "html", "grateful.html");

            string htmlTemplate = File.ReadAllText(htmlPath);

            htmlTemplate = htmlTemplate.Replace("{evento}", eventItem.Name);

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
                    options.NewValue = eventItem.Date.ToString("d 'de' MMMM 'de' yyyy");
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

                    _mailService.SendMailCheckfy(mailMessage);
                }
            }
            return ResponseModel.Success();

        }

        public Event Get(Guid id)
        {
            return _eventRepository.GetByID(id);
        }

        public int CountGuests(Guid eventId)
        {
            return _guestRepository.Count(x => x.EventId == eventId);
        }

        public ResponseModel<object> Add(EventDTO model)
        {
            try
            {
                var userId = _userContextService.UserGuid;

                if (string.IsNullOrEmpty(model.Name))
                {
                    return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Nome é obrigatório.");
                }

                if (model.Date.Date < DateTime.Now.Date)
                {
                    return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Data inválida.");
                }

                if (model.StartTime >= model.EndTime)
                {
                    return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Horário inicial não pode ser maior que horário final.");
                }

                if (model.EventTypeId == Guid.Empty)
                {
                    return ResponseModel<object>.Error(HttpStatusCode.BadRequest, "Tipo de evento é obrigatório.");
                }

                Event newEvent = new Event
                {
                    Date = model.Date,
                    StartTime = model.StartTime,
                    EndTime = model.EndTime,
                    Pax = model.Pax,
                    Name = model.Name,
                    EventTypeId = model.EventTypeId,
                    UserId = userId,
                };

                if (model.PhotoFile != null)
                {
                    newEvent.Photo = _storageService.UploadFile(model.PhotoFile, $"{newEvent.Id}");
                }

                _eventRepository.Insert(newEvent);

                return ResponseModel<object>.Success(new { id = newEvent.Id, photoFullUrl = $"{Default.URL}{newEvent.Photo}" });
            }
            catch (Exception ex)
            {
                return ResponseModel<object>.Error(HttpStatusCode.InternalServerError, ex.Message);

            }

        }
    }
}
