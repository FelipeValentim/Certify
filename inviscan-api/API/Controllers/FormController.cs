using API.Models;
using Domain.DTO;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InviScan.Controllers
{
	[AllowAnonymous]
	[ApiController]
	[Route("[controller]")]
	public class FormController : Controller
    {
        private readonly IEventRepository _eventRepository;
		private readonly IGuestService _guestService;

		public FormController(IEventRepository eventRepository, IGuestService guestService)
        {
            _eventRepository = eventRepository;
            _guestService = guestService;
        }


        [HttpGet("Guest/{eventId}")]
        public ActionResult FormGuest(Guid eventId)
        {
            var eventItem = _eventRepository.Get(x => x.Id == eventId, includeProperties: "User");

            if (eventItem == null)
            {
                return View("Error");
            }

            var item = new EventViewModel
            {
                Id = eventItem.Id,
                Date = eventItem.Date,
                StartTime = eventItem.StartTime,
                EndTime = eventItem.EndTime,
                Name = eventItem.Name,
                Photo = eventItem.Photo,
                User = new UserViewModel
                {
                    Id = eventItem.User.Id,
                    Name = eventItem.User.Name,
				}
            };

            return View("NewGuest", item);
        }

		[HttpPost("NewGuest")]
		public ActionResult NewGuest(GuestDTO model)
		{
            _guestService.SetStudentGuestType(ref model);

            var response = _guestService.Add(model);

			return StatusCode(response.Code, response.Result);
		}
	}
}
