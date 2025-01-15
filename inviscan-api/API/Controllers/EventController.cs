using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces.Services;
using Domain.Interfaces.Repositories;
using API.Models;
using Domain.Entities;
using Services;
using Domain.DTO;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IUserContextService _userContextService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IEventRepository _eventRepository;
        private readonly IGuestRepository _guestRepository;
        private readonly IDocumentService _documentService;
		private readonly IEventService _eventService;
		public EventController(IUserContextService userContextService,  IEventRepository eventRepository, IGuestRepository guestRepository, IWebHostEnvironment webHostEnvironment, 
            IDocumentService documentService, IEventService eventService)
        {
            _eventRepository = eventRepository;
			_userContextService = userContextService;
            _guestRepository = guestRepository;
            _webHostEnvironment = webHostEnvironment;
            _documentService = documentService;
			_eventService = eventService;

        }

        [HttpGet("GetEvents")]
        public IActionResult GetEvents()
        {
            try
            {
                var userId = _userContextService.UserGuid;

				var events = _eventRepository.GetEvents(userId);

                var items = events.Select(e => new EventViewModel
                {
                    Id = e.Id,
                    Date = e.Date,
					StartTime = e.StartTime,
					EndTime = e.EndTime,
					Name = e.Name,
                    Photo = e.Photo,
                    EventType = new EventTypeViewModel
                    {
                        Name = e.EventType.Name,
                    }
                });

                return StatusCode(StatusCodes.Status200OK, items);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


		[HttpDelete("Delete/{id}")]
		public IActionResult Delete(Guid id)
		{
			try
			{
				_eventRepository.Delete(id);

				return StatusCode(StatusCodes.Status200OK, "Deleção realizada com sucesso.");
			}
			catch (Exception ex)
			{
				return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
			}
		}


		[HttpPost("NewEvent")]
		public IActionResult NewEvent(EventDTO model)
		{
            var response = _eventService.Add(model);

            return StatusCode(response.Code, response.Data);
		}

		[HttpGet("GetEvent/{id}")]
        public IActionResult GetEvent(Guid id)
        {
            try
            {
				EventViewModel item;

                var eventItem = _eventRepository.Get(x => x.Id == id, includeProperties: "EventTemplate");

                item = new EventViewModel
				{
                    Id = eventItem.Id,
                    Date = eventItem.Date,
					StartTime = eventItem.StartTime,
					EndTime = eventItem.EndTime,
					Name = eventItem.Name,
                    Photo = eventItem.Photo,
                    EventTemplateId = eventItem.EventTemplateId,
					EventTemplate = eventItem.EventTemplateId.HasValue
		            ? new EventTemplateViewModel
		            {
			            Path = eventItem.EventTemplate.Path,
                        PreviewPath = eventItem.EventTemplate.PreviewPath,
		            }
		            : null
				};

                var guests = _guestRepository.GetGuests(item.Id);

                item.Guests = guests.Select(x => new GuestViewModel
                {
                    Id = x.Id,
                    Name = x.Name,
                    Photo = x.Photo,
					CheckinDate = x.CheckinDate,
                    Email = x.Email,
                    GuestType = new GuestTypeViewModel
                    {
                        Name = x.GuestType.Name,
                    }
                });


				return StatusCode(StatusCodes.Status200OK, item);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("Certificado/Download/{eventId}")]
        public IActionResult DownloadCertificates(Guid eventId)
        {
            var result = _eventService.DownloadCertificates(eventId);

            return StatusCode(result.Code, result.Data);
        }

		[HttpPost("Certificado/Send/{eventId}")]
		public IActionResult SendCertificates(Guid eventId)
		{
			var result = _eventService.SendCertificates(eventId);

			return StatusCode(result.Code, result.Data);
		}
	}
}
