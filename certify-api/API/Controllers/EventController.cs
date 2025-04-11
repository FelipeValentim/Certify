using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces.Services;
using API.Models;
using Domain.DTO;
using Services.Attributes;
using Domain.Constants;
using Domain.Entities;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;
        private readonly IEventFieldService _eventFieldService;
        public EventController(IEventService eventService, IEventFieldService eventFieldService)
        {
            _eventService = eventService;
            _eventFieldService = eventFieldService;
        }

        [HttpGet("GetEvents")]
        public IActionResult GetEvents()
        {
            var events = _eventService.GetEvents();

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


        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(Guid id)
        {
            _eventService.Delete(id);

            return StatusCode(StatusCodes.Status200OK);
        }


        [HttpPost("NewEvent")]
        public IActionResult NewEvent(EventDTO model)
        {
            var response = _eventService.Add(model);

            return StatusCode(StatusCodes.Status200OK, response);
        }

        [HttpGet("GetEvent/{id}")]
        public IActionResult GetEvent(Guid id)
        {

            var eventItem = _eventService.GetRelated(id);

            var item = new EventViewModel
            {
                Id = eventItem.Id,
                Date = eventItem.Date,
                StartTime = eventItem.StartTime,
                EndTime = eventItem.EndTime,
                Name = eventItem.Name,
                Photo = eventItem.Photo,
                EventTemplateId = eventItem.EventTemplateId,
                Pax = eventItem.Pax,
                CheckinEnabled = eventItem.CheckinEnabled,
                EventTemplate = eventItem.EventTemplateId.HasValue
                ? new EventTemplateViewModel
                {
                    Path = eventItem.EventTemplate.Path,
                    PreviewPath = eventItem.EventTemplate.PreviewPath,
                }
                : null,
                Guests = eventItem.Guests.Select(x => new GuestViewModel
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
                }),
            };

            return StatusCode(StatusCodes.Status200OK, item);

        }

        [HttpPut("CheckinEnabledMode")]
        public IActionResult CheckinEnabledMode(EventDTO model)
        {
            _eventService.CheckinEnabledMode(model);

            return StatusCode(StatusCodes.Status200OK);
        }

        [HttpGet("Certificado/Download/{eventId}")]
        public IActionResult DownloadCertificates(Guid eventId)
        {
            var response = _eventService.DownloadCertificates(eventId);

            return StatusCode(StatusCodes.Status200OK, response);
        }

        [HttpPost("Certificado/Send/{eventId}")]
        public IActionResult SendCertificates(Guid eventId)
        {
            _eventService.SendCertificates(eventId);

            return StatusCode(StatusCodes.Status200OK);
        }

        [AllowAnonymous]
        [HttpGet("QRCode/{eventId}")]
        public ActionResult GenerateCheckinQRCode(Guid eventId)
        {
            var response = _eventService.GenerateCheckinQRCode(eventId);

            return File(response.Data, response.MimeType);
        }

        [AllowAnonymous]
        [HttpGet("QRCode/decode/{eventId}")]
        [DecodeHash(Salt.EventId)]
        public ActionResult DecodeQRCodeEvent(string eventId)
        {
            var response = _eventService.GetByDecodedId(eventId);

            return StatusCode(StatusCodes.Status200OK, response);
        }

        [HttpGet("{eventId}/EventField")]
        public ActionResult GetEventFields(Guid eventId)
        {
            var eventFields = _eventFieldService.GetAll(eventId);

            var items = eventFields.Select(s => new EventFieldViewModel
            {
                Id = s.Id,
                Name = s.Name,
                Type = s.Type.ToString(),
                DisplayOrder = s.DisplayOrder
            });

            return StatusCode(StatusCodes.Status200OK, items);
        }

        [HttpPost("EventField")]
        public ActionResult PostEventField(EventFieldDTO eventFieldDTO)
        {
            var response = _eventFieldService.Add(eventFieldDTO);

            var eventField = _eventFieldService.Get(response);

            var item = new EventFieldViewModel
            {
                Id = eventField.Id,
                Name = eventField.Name,
                Type = eventField.Type.ToString(),
                DisplayOrder = eventField.DisplayOrder
            };

            return StatusCode(StatusCodes.Status200OK, item);
        }

        [HttpPut("EventField/Reorder")]
        public ActionResult EventReorderField(EventReorderFieldDTO eventReorderField)
        {
            _eventFieldService.ReorderFields(eventReorderField);

            return StatusCode(StatusCodes.Status200OK);
        }

        [HttpPut("{eventId}/EventField/Reorder")]
        public ActionResult EventReorderField(Guid[] reorderFields, Guid eventId)
        {
            _eventFieldService.ReorderFields(reorderFields, eventId);

            return StatusCode(StatusCodes.Status200OK);
        }
    }
}
