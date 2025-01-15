using API.Models;
using Domain.DTO;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace InviScan.Controllers
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


        [HttpGet("Guest/{eventId}")]
        public ActionResult FormGuest(Guid eventId)
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
    }
}
