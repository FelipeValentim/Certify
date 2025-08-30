using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces.Services;
using API.Models;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class GuestTypeController : ControllerBase
    {
        private readonly IGuestTypeService _guestTypeService;
        public GuestTypeController(IGuestTypeService guestTypeService)
        {
            _guestTypeService = guestTypeService;
        }

        [HttpGet("GetGuestTypes")]
        public IActionResult GetGuestTypes()
        {
            var guestTypes = _guestTypeService.GetAll();

            var items = guestTypes.Select(e => new GuestTypeViewModel
            {
                Id = e.Id,
                Name = e.Name,
            });

            return StatusCode(StatusCodes.Status200OK, items);
        }

    }
}
