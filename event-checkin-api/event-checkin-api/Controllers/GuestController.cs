using event_checkin_api.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static event_checkin_api.Models.DatabaseModels;

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
            await Task.Delay(200);

            var guests = _guestRepository.GetGuests(eventId);

            return StatusCode(StatusCodes.Status200OK, guests);
        }

        [HttpPut("Checkin/{id}")]
        public async Task<IActionResult> Checkin(string id)
        {
            await Task.Delay(200);

            var guest = _guestRepository.GetGuest(id);

            if (guest == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Convidado não existe.");
            }

            if (guest.DateCheckin.HasValue)
            {
                return StatusCode(StatusCodes.Status409Conflict, "Já foi realizado checkin para este convidado.");
            }

            _guestRepository.Checkin(id);

            return StatusCode(StatusCodes.Status200OK, "Checkin realizado com sucesso.");
        }

        [HttpPut("Uncheckin/{id}")]
        public async Task<IActionResult> Uncheckin(string id)
        {
            await Task.Delay(200);

            var guest = _guestRepository.GetGuest(id);

            if (guest == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Convidado não existe.");
            }

            if (!guest.DateCheckin.HasValue)
            {
                return StatusCode(StatusCodes.Status409Conflict, "Já foi desfeito o checkin para este convidado.");
            }

            _guestRepository.Uncheckin(id);

            return StatusCode(StatusCodes.Status200OK, "Checkin desfeito com sucesso.");
        }

    }
}
