﻿using Domain.Constants;
using Domain.DTO;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;
using Services.Attributes;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class GuestController : ControllerBase
    {
        private readonly IGuestService _guestService;

        public GuestController(IGuestService guestService)
        {
            _guestService = guestService;
        }

        [HttpPut("Checkin/{id}")]
        public IActionResult Checkin(Guid id)
        {
            var response = _guestService.Checkin(id);

            return StatusCode(response.Code, response.Data);
        }

        [HttpPut("Uncheckin/{id}")]
        public IActionResult Uncheckin(Guid id)
        {
            var response = _guestService.Uncheckin(id);

            return StatusCode(response.Code, response.Data);
        }

        [HttpPut("Checkin")]
        public IActionResult Checkin(Guid[] ids)
        {
            var response = _guestService.Checkin(ids);

            return StatusCode(response.Code, response.Data);
        }


        [HttpPut("Uncheckin")]
        public IActionResult Uncheckin(Guid[] ids)
        {
            var response = _guestService.Uncheckin(ids);

            return StatusCode(response.Code, response.Data);
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(Guid id)
        {
            var response = _guestService.Delete(id);

            return StatusCode(response.Code, response.Data);
        }

        [HttpDelete("Delete")]
        public IActionResult Delete(Guid[] ids)
        {
            var response = _guestService.Delete(ids);

            return StatusCode(response.Code, response.Data);
        }

        [HttpPost("NewGuest")]
        public IActionResult Post(GuestDTO model)
        {
            var response = _guestService.Add(model);

            return StatusCode(response.Code, response.Data);
        }

        [HttpPost("Invitations/{eventId}")]
        public IActionResult Invitations(Guid[] ids, Guid eventId)
        {
            var response = _guestService.SendInvitations(eventId, ids);

            return StatusCode(response.Code, response.Data);
        }

        [HttpPost("Certificates/{eventId}")]
        public IActionResult Certificates(Guid[] ids, Guid eventId)
        {
            var response = _guestService.SendCertificates(eventId, ids);

            return StatusCode(response.Code, response.Data);
        }

        [AllowAnonymous]
        [HttpGet("QRCode/{guestId}")]
        [DecodeHash(Salt.GuestGUID)]
        public ActionResult GenerateCheckinQRCode(string guestId)
        {
            FileDTO response = _guestService.GenerateCheckinQRCode(guestId);

            return File(response.Data, response.MimeType);
        }

    }
}
