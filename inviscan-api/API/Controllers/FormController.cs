using API.Models;
using Domain.Constants;
using Domain.DTO;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Services.Attributes;
using Services.Helper;

namespace InviScan.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("[controller]")]
    public class FormController : Controller
    {
        private readonly IGuestService _guestService;
        private readonly IFormService _formService;
        private readonly IEventService _eventService;

        public FormController(IGuestService guestService, IFormService formService, IEventService eventService)
        {
            _guestService = guestService;
            _formService = formService;
            _eventService = eventService;
        }

        [DecodeHash]
        [HttpGet("Guest/{eventId}")]
        public ActionResult FormGuest(string eventId)
        {
            var response = _formService.GenerateForm(eventId);

            return View(response.Succeed ? "NewGuest" : "~/Views/Shared/Error.cshtml", response.Data);
        }

        [HttpPost("NewGuest")]
        public ActionResult NewGuest(GuestDTO model)
        {
            _guestService.SetStudentGuestType(ref model);

            var response = _guestService.Add(model);

            return StatusCode(response.Code, response.Data);
        }

        [DecodeHash(Salt.Salt2)]
        [HttpGet("Checkin/{eventId}")]
        public ActionResult FormCheckin(string eventId)
        {
            var response = _formService.GenerateForm(eventId);

            return View(response.Succeed ? "Checkin" : "~/Views/Shared/Error.cshtml", response.Data);
        }

        [DecodeHash(Salt.GuestGUID)]
        [HttpGet("Guest/Search/{accesscode}")]
        public ActionResult SearchGuest(string accesscode)
        {
            var response = _guestService.Get(accesscode);

            return StatusCode(response.Code, response.Data);
        }

        [DecodeHash(Salt.GuestGUID)]
        [HttpPut("Guest/Checkin/{accesscode}")]
        public ActionResult CheckinGuest(string accesscode)
        {
            var response = _guestService.Checkin(accesscode);

            return StatusCode(response.Code, response.Data);
        }

    }
}
