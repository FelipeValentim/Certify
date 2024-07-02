using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository;
using static API.Models.EventModels;
using static API.Models.GuestModels;
using Infrastructure.Helpers;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly EventRepository _eventRepository;
        private readonly GuestRepository _guestRepository;
        public EventController(IHttpContextAccessor httpContextAccessor, EventRepository eventRepository, GuestRepository guestRepository)
        {
            _eventRepository = eventRepository;
            _httpContextAccessor = httpContextAccessor;
            _guestRepository = guestRepository;
        }

        [HttpGet("GetEvents")]
        public async Task<IActionResult> GetEvents() 
        {
            await Task.Delay(500);

            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(CustomClaimTypes.Id);

            var events = _eventRepository.GetEvents(userId);

            return StatusCode(StatusCodes.Status200OK, events);
        }

        [HttpGet("GetEvent/{id}")]
        public async Task<IActionResult> GetEvent(int id)
        {
            await Task.Delay(500);

            EventItem item;

            var eventItem = _eventRepository.GetByID(id);

            var guestsItems = _guestRepository.GetGuests(eventItem.Id);

            item = new EventItem
            {
                Id = eventItem.Id,
                Date = eventItem.Date.ToString(),
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
