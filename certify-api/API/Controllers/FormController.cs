using API.Models;
using Domain.Constants;
using Domain.DTO;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Services.Attributes;
using Services.Helper;

namespace Certify.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("[controller]")]
    public class FormController : Controller
    {
        private readonly IGuestService _guestService;
        private readonly IFormService _formService;

        public FormController(IGuestService guestService, IFormService formService)
        {
            _guestService = guestService;
            _formService = formService;
        }

        [DecodeHash]
        [HttpGet("Guest/{eventId}")]
        public ActionResult FormGuest(string eventId)
        {
            ResponseModel<EventDTO> response = _formService.GenerateRegistrationForm(eventId);

            return View(response.Succeed ? "NewGuest" : "~/Views/Shared/Error.cshtml", response.Data);
        }

        [HttpPost("NewGuest")]
        public ActionResult NewGuest(GuestDTO model)
        {
            ResponseModel<object> response = _formService.AddGuest(model);

            return StatusCode(response.Code, response.Data);
        }

        [DecodeHash(Salt.Salt2)]
        [HttpGet("Checkin/{eventId}")]
        public ActionResult FormCheckin(string eventId)
        {
            ResponseModel<EventDTO> response = _formService.GenerateCheckinForm(eventId);

            return View(response.Succeed ? "Checkin" : "~/Views/Shared/Error.cshtml", response.Data);
        }

        [DecodeHash(Salt.GuestGUID)]
        [HttpGet("Guest/Search/{accesscode}")]
        public ActionResult SearchGuest(string accesscode)
        {
            ResponseModel<GuestDTO> response = _guestService.Get(accesscode);

            return StatusCode(response.Code, response.Data);
        }

        [DecodeHash(Salt.GuestGUID)]
        [HttpPut("Guest/Checkin/{accesscode}")]
        public ActionResult CheckinGuest(string accesscode)
        {
            ResponseModel response = _formService.CheckinGuest(accesscode);

            return StatusCode(response.Code, response.Data);
        }

    }
}
