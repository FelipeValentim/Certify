using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces.Services;
using Domain.Interfaces.Repositories;
using API.Models;
using Domain.Entities;
using Services;
using Domain.DTO;
using Services.Helper;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;
        public EventController(IEventService eventService)
        {
            _eventService = eventService;

        }

        [HttpGet("GetEvents")]
        public IActionResult GetEvents()
        {
            try
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
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(Guid id)
        {
            var response = _eventService.Delete(id);

            return StatusCode(response.Code, response.Payload);
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

        [AllowAnonymous]
        [HttpGet("QRCode/{eventId}")]
        public ActionResult GenerateCheckinQRCode(Guid eventId)
        {
            var response = _eventService.GenerateCheckinQRCode(eventId);

            return File(response.Data, response.MimeType);
        }
    }
}
