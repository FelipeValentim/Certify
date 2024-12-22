using API.Models;
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
        public FormController(IEventRepository eventRepository)
        {
            _eventRepository = eventRepository;
        }


        [HttpGet("NewGuest/{eventId}")]
        public ActionResult NewGuest(Guid eventId)
        {
            var eventItem = _eventRepository.Get(x => x.Id == eventId, includeProperties: "User");

            if (eventItem == null)
            {
                return View("Error");
            }

            var item = new EventViewModel
            {
                Id = eventItem.Id,
                Date = eventItem.Date.ToString("dd/MM/yyyy "),
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
    }
}
