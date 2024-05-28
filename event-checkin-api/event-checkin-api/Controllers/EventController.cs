using event_checkin_api.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace event_checkin_api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly EventRepository _eventRepository;
        public EventController(IHttpContextAccessor httpContextAccessor,EventRepository eventRepository)
        {
            _eventRepository = eventRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("GetEvents")]
        public IActionResult GetEvents() 
        {
            var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(Constants.ClaimTypes.Id);

            var events = _eventRepository.GetEvents(userId);

            return StatusCode(StatusCodes.Status200OK, events);
        }

    }
}
