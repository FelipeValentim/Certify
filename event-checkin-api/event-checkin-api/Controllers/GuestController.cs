using event_checkin_api.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace event_checkin_api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class GuestController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly GuestRepository _guestRepository;
        public GuestController(IHttpContextAccessor httpContextAccessor, GuestRepository guestRepository)
        {
            _guestRepository = guestRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("GetGuests/{eventId}")]
        public async Task<IActionResult> GetGuests(string eventId) 
        {
            await Task.Delay(2000);

            var guests = _guestRepository.GetGuests(eventId);

            return StatusCode(StatusCodes.Status200OK, guests);
        }

    }
}
