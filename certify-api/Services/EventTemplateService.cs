using Domain.Constants;
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
				var allowedMimeTypes = new[] { "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };

				if (!Array.Exists(allowedMimeTypes, mime => mime.Equals(file.MimeType, StringComparison.OrdinalIgnoreCase)))
				{
					return ResponseModel.Error(HttpStatusCode.BadRequest, "Tipo de arquivo inválido.");
				}

				if (file.Size >= 10 * 1024 * 1024) //10MB LIMIT
				{
					return ResponseModel.Error(HttpStatusCode.BadRequest, "Documento ultrapassa 10mb.");
				}

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


				var previewFile = _documentService.ConvertDocumentToPdf(file);

                previewFile.Path = GeneratePreviewPath(eventId);

                _storageService.UploadFile(previewFile).GetAwaiter().GetResult();

                var path = _storageService.UploadTemplate(file, eventId).GetAwaiter().GetResult();

				var eventTemplateEntity = new EventTemplate
				{
					Path = path,
					PreviewPath = previewFile.Path
				};

				_eventTemplateRepository.Insert(eventTemplateEntity);

				entity.EventTemplateId = eventTemplateEntity.Id;

				_eventRepository.Update(entity);

				return ResponseModel.Success(payload: $"{UrlManager.Storage}{eventTemplateEntity.PreviewPath}");
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
