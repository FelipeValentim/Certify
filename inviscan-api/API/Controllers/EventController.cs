using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository;
using static API.Models.EventModels;
using static API.Models.GuestModels;
using Infrastructure.Helpers;
using System.Security.Claims;
using Repository.Interfaces;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IEventRepository _eventRepository;
        private readonly IGuestRepository _guestRepository;
        public EventController(IHttpContextAccessor httpContextAccessor, IEventRepository eventRepository, IGuestRepository guestRepository)
        {
            _eventRepository = eventRepository;
            _httpContextAccessor = httpContextAccessor;
            _guestRepository = guestRepository;
        }

        [HttpGet("GetEvents")]
        public async Task<IActionResult> GetEvents()
        {
            try
            {
                await Task.Delay(200);

                var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(CustomClaimTypes.Id);

                var events = _eventRepository.GetEvents(userId);

                var items = events.Select(e => new EventItem
                {
                    Id = e.Id,
                    Date = e.Date.ToString("dd/MM/yyyy"),
                    Name = e.Name,
                    Photo = e.Photo,
                });

                return StatusCode(StatusCodes.Status200OK, items);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("GetEvent/{id}")]
        public async Task<IActionResult> GetEvent(Guid id)
        {
            try
            {
                await Task.Delay(200);

                EventItem item;

                var eventItem = _eventRepository.GetEventWithGuests(id);

                item = new EventItem
                {
                    Id = eventItem.Id,
                    Date = eventItem.Date.ToString(),
                    Name = eventItem.Name,
                    Photo = eventItem.Photo,
                    Guests = eventItem.Guests.Where(x => !x.IsDeleted).Select(x => new GuestItem
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Photo = x.Photo,
                        Checkin = x.DateCheckin?.ToString("dd/MM/yyyy"),
                    }).ToList(),
                };

                return StatusCode(StatusCodes.Status200OK, item);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

    }
}
