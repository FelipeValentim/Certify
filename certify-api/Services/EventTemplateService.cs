using Domain.Constants;
using Domain.DTO;
using Domain.Entities;
using Domain.Exceptions;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Hosting;
using Spire.Doc;
using Spire.Doc.Interface;
using System.Net;

namespace Services
{
    public class EventTemplateService : IEventTemplateService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IEventTemplateRepository _eventTemplateRepository;
        private readonly IStorageService _storageService;
        private readonly IDocumentService _documentService;
        public EventTemplateService(IEventRepository eventRepository, IStorageService storageService, IDocumentService documentService, IEventTemplateRepository eventTemplateRepository)
        {
            _eventRepository = eventRepository;
            _storageService = storageService;
            _documentService = documentService;
            _eventTemplateRepository = eventTemplateRepository;
        }

        public EventTemplate Get(Guid id)
        {
            return _eventTemplateRepository.GetByID(id);
        }


        public async Task<string> UploadTemplateAsync(FileDTO file, Guid eventId)
        {
            var allowedMimeTypes = new[] { "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };

            if (!Array.Exists(allowedMimeTypes, mime => mime.Equals(file.MimeType, StringComparison.OrdinalIgnoreCase)))
            {
                throw new BusinessException("Tipo de arquivo inválido.");
            }

            if (file.Size >= 10 * 1024 * 1024) //10MB LIMIT
            {
                throw new BusinessException("Documento ultrapassa 10mb.");
            }

            if (eventId == Guid.Empty)
            {
                throw new BusinessException("Evento inválido.");
            }

            if (!_documentService.PlaceholderExists(file, "{Nome}"))
            {
                throw new BusinessException("Não existe placeholder de {Nome} no documento");
            }

            var entity = _eventRepository.GetByID(eventId);

            if (entity == null)
            {
                throw new NotFoundException("Evento não existe ou foi deletado.");
            }

            if (entity.EventTemplateId.HasValue)
            {
                throw new ConflictException("Evento já possui template.");
            }

            var previewFile = _documentService.ConvertDocumentToPdf(file);

            previewFile.Path = $"{eventId}";
            file.Path = $"{eventId}";

            var previewPath = await _storageService.UploadFile(previewFile);

            var path = await _storageService.UploadFile(file);

            var eventTemplateEntity = new EventTemplate
            {
                Path = path,
                PreviewPath = previewPath
            };

            _eventTemplateRepository.Insert(eventTemplateEntity);

            entity.EventTemplateId = eventTemplateEntity.Id;

            _eventRepository.Update(entity);

            return $"{UrlManager.Storage}{previewPath}";
        }

        public void RemoveTemplate(Guid eventId)
        {
            if (eventId == Guid.Empty)
            {
                throw new BusinessException("Evento inválido.");
            }

            var eventEntity = _eventRepository.GetByID(eventId);

            if (eventEntity == null)
            {
                throw new NotFoundException("Evento não existe ou foi deletado.");
            }

            if (!eventEntity.EventTemplateId.HasValue)
            {
                throw new NotFoundException("Template não existe para este evento.");
            }

            var eventTemplateId = eventEntity.EventTemplateId.Value;

            eventEntity.EventTemplateId = null;

            _eventRepository.Update(eventEntity);

            _eventTemplateRepository.Delete(eventTemplateId, true);
        }
    }
}
