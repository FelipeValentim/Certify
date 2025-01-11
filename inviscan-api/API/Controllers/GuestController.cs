using API.Models;
using Domain.DTO;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using InviScan.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class GuestController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IGuestRepository _guestRepository;
		private readonly IGuestService _guestService;

		public GuestController(IHttpContextAccessor httpContextAccessor, IGuestRepository guestRepository, IStorageService storageService, IGuestService guestService)
        {
            _guestRepository = guestRepository;
            _httpContextAccessor = httpContextAccessor;
            _guestService = guestService;
        }

        [HttpGet("GetGuests/{eventId}")]
        public IActionResult GetGuests(Guid eventId)
        {
            try
            {
                var guests = _guestRepository.GetGuests(eventId);

                return StatusCode(StatusCodes.Status200OK, guests);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("Checkin/{id}")]
        public IActionResult Checkin(Guid id)
        {
            try
            {
                var guest = _guestRepository.GetByID(id);

                if (guest == null)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Convidado não existe.");
                }

                if (guest.CheckinDate.HasValue)
                {
                    return StatusCode(StatusCodes.Status409Conflict, "Já foi realizado checkin para este convidado.");
                }

                _guestRepository.Checkin(id);

                return StatusCode(StatusCodes.Status200OK, "Checkin realizado com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("Uncheckin/{id}")]
        public IActionResult Uncheckin(Guid id)
        {
            try
            {
                var guest = _guestRepository.GetByID(id);

                if (guest == null)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Convidado não existe.");
                }

                if (!guest.CheckinDate.HasValue)
                {
                    return StatusCode(StatusCodes.Status409Conflict, "Já foi desfeito o checkin para este convidado.");
                }

                _guestRepository.Uncheckin(id);

                return StatusCode(StatusCodes.Status200OK, "Checkin desfeito com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("Checkin")]
        public IActionResult Checkin(Guid[] ids)
        {
            try
            {
                _guestRepository.Checkin(ids);

                return StatusCode(StatusCodes.Status200OK, "Checkin realizado com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpPut("Uncheckin")]
        public IActionResult Uncheckin(Guid[] ids)
        {
            try
            {
                _guestRepository.Uncheckin(ids);

                return StatusCode(StatusCodes.Status200OK, "Checkin desfeito com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("Delete/{id}")]
        public IActionResult Delete(Guid id)
        {
            try
            {
                _guestRepository.Delete(id);

                return StatusCode(StatusCodes.Status200OK, "Deleção realizada com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("Delete")]
        public IActionResult Delete(Guid[] ids)
        {
            try
            {
                _guestRepository.Delete(ids);

                return StatusCode(StatusCodes.Status200OK, "Deleção realizada com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("NewGuest")]
        public IActionResult Post(GuestDTO model)
        {
            var response = _guestService.Add(model);

			return StatusCode(response.Code, response.Data);
		}

	}
}
