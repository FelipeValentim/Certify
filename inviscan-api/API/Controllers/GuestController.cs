using API.Models;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using InviScan.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class GuestController : ControllerBase
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IGuestRepository _guestRepository;
        private readonly IGoogleDriveService _googleDriveService;

        public GuestController(IHttpContextAccessor httpContextAccessor, IGuestRepository guestRepository, IGoogleDriveService googleDriveService)
        {
            _guestRepository = guestRepository;
            _httpContextAccessor = httpContextAccessor;
            _googleDriveService = googleDriveService;
        }

        [HttpGet("GetGuests/{eventId}")]
        public async Task<IActionResult> GetGuests(Guid eventId)
        {
            try
            {
                await Task.Delay(200);

                var guests = _guestRepository.GetGuests(eventId);

                return StatusCode(StatusCodes.Status200OK, guests);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("Checkin/{id}")]
        public async Task<IActionResult> Checkin(Guid id)
        {
            try
            {


                await Task.Delay(200);

                var guest = _guestRepository.GetByID(id);

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
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("Uncheckin/{id}")]
        public async Task<IActionResult> Uncheckin(Guid id)
        {
            try
            {
                await Task.Delay(200);

                var guest = _guestRepository.GetByID(id);

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
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPut("Checkin")]
        public async Task<IActionResult> Checkin(Guid[] ids)
        {
            try
            {
                await Task.Delay(200);

                _guestRepository.Checkin(ids);

                return StatusCode(StatusCodes.Status200OK, "Checkin realizado com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpPut("Uncheckin")]
        public async Task<IActionResult> Uncheckin(Guid[] ids)
        {
            try
            {
                await Task.Delay(200);

                _guestRepository.Uncheckin(ids);

                return StatusCode(StatusCodes.Status200OK, "Checkin desfeito com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await Task.Delay(200);

                _guestRepository.DeleteGuest(id);

                return StatusCode(StatusCodes.Status200OK, "Deleção realizada com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> Delete(Guid[] ids)
        {
            try
            {
                await Task.Delay(200);

                _guestRepository.DeleteGuests(ids);

                return StatusCode(StatusCodes.Status200OK, "Deleção realizada com sucesso.");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [AllowAnonymous]
        [HttpPost("NewGuest")]
        public async Task<IActionResult> Post(GuestViewModel model)
        {
            await Task.Delay(200);

            try
            {
                if (string.IsNullOrEmpty(model.Name))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Nome e obrigatorio.");
                }

                var guest = new Guest()
                {
                    Name = model.Name,
                    DateCheckin = null,
                    EventId = model.Event
                };

                if (!string.IsNullOrEmpty(model.Photo))
                {
                    var photo = _googleDriveService.UploadBase64Image(model.Photo.Split(',')[1]);
                }

                _guestRepository.Insert(guest);

                return StatusCode(StatusCodes.Status200OK, guest);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }

        }

    }
}
