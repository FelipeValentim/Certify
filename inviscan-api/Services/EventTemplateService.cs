using Domain.DTO;
using Domain.Entities;
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
		private readonly IWebHostEnvironment _webHostEnvironment;
		public EventTemplateService(IEventRepository eventRepository,  IStorageService storageService, IDocumentService documentService, IWebHostEnvironment webHostEnvironment, IEventTemplateRepository eventTemplateRepository)
		{
			_eventRepository = eventRepository;
			_storageService = storageService;
			_documentService = documentService;
			_webHostEnvironment = webHostEnvironment;
			_eventTemplateRepository = eventTemplateRepository;
		}

		private string GeneratePreviewPath(Guid eventId)
		{
			var relativePath = $"/storage/{eventId}/preview.pdf";

			return relativePath;
		}

		public ResponseModel UploadTemplate(FileDTO file, Guid eventId)
		{
			try
			{
				if (eventId == Guid.Empty)
				{
					return ResponseModel.Error(HttpStatusCode.BadRequest, "Evento inválido.");
				}

				if (!_documentService.PlaceholderExists(file, "{nome}"))
				{
					return ResponseModel.Error(HttpStatusCode.BadRequest, "Não existe placeholder de {nome} no documento");
				}

				var entity = _eventRepository.GetByID(eventId);

				if (entity == null)
				{
					return ResponseModel.Error(HttpStatusCode.NotFound, "Evento não existe ou foi deletado.");
				}

				if (entity.EventTemplateId.HasValue)
				{
					return ResponseModel.Error(HttpStatusCode.NotFound, "Evento já possui template.");
				}

				var relativePath = GeneratePreviewPath(eventId);

				_documentService.GeneratePreview(file, relativePath);

				var path = _storageService.UploadFile(file, eventId);

				var eventTemplateEntity = new EventTemplate
				{
					Path = path,
					PreviewPath = relativePath
				};

				_eventTemplateRepository.Insert(eventTemplateEntity);

				entity.EventTemplateId = eventTemplateEntity.Id;

				_eventRepository.Update(entity);

				return ResponseModel.Success();
			}
			catch (Exception ex)
			{
				return ResponseModel.Error(HttpStatusCode.InternalServerError, ex.Message);
			}
		}

		public ResponseModel RemoveTemplate(Guid eventId)
		{
			if (eventId == Guid.Empty)
			{
				return ResponseModel.Error(HttpStatusCode.BadRequest, "Evento inválido.");
			}

			var eventEntity = _eventRepository.GetByID(eventId);

			if (eventEntity == null)
			{
				return ResponseModel.Error(HttpStatusCode.NotFound, "Evento não existe ou foi deletado.");
			}

			if (!eventEntity.EventTemplateId.HasValue)
			{
				return ResponseModel.Error(HttpStatusCode.NotFound, "Template não existe para este evento.");
			}

			var eventTemplateId = eventEntity.EventTemplateId.Value;

			eventEntity.EventTemplateId = null;

			_eventRepository.Update(eventEntity);

			_eventTemplateRepository.Delete(eventTemplateId, true);

			return ResponseModel.Success();
		}
	}
}
