using event_checkin_api.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static event_checkin_api.Models.EventModels;
using static event_checkin_api.Models.GuestModels;

namespace event_checkin_api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly EventRepository _eventRepository;
        private readonly GuestRepository _guestRepository;
        public EventController(IHttpContextAccessor httpContextAccessor,EventRepository eventRepository, GuestRepository guestRepository)
        {
            _eventRepository = eventRepository;
            _httpContextAccessor = httpContextAccessor;
            _guestRepository = guestRepository;
        }

        [HttpGet("GetEvents")]
        public async Task<IActionResult> GetEvents() 
        {
            await Task.Delay(500);

            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(Constants.ClaimTypes.Id);

            var events = _eventRepository.GetEvents(userId);

            return StatusCode(StatusCodes.Status200OK, events);
        }

        [HttpGet("GetEvent/{id}")]
        public async Task<IActionResult> GetEvent(string id)
        {
            await Task.Delay(500);

            EventItem item;

            var eventItem = _eventRepository.GetEvent(id);

            var guestsItems = _guestRepository.GetGuests(eventItem.Id);

            item = new EventItem
            {
                Id = eventItem.Id,
                Date = eventItem.DateEvent,
                Name = eventItem.Name,
                Photo = eventItem.Photo,
                Guests = guestsItems.Select(x  => new GuestItem
                {
                    Id = x.Id,
                    Name = x.Name,
                    Photo = x.Photo,
                    Checkin = x.DateCheckin?.ToString("dd/MM/yyyy"),
                }).ToList(),
            }; 

            return StatusCode(StatusCodes.Status200OK, item);
        }

    }
}
