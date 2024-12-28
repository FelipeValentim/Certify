using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository;
using System.Security.Claims;
using InviScan;
using Xceed.Words.NET;
using Microsoft.Extensions.Logging;
using Xceed.Document.NET;
using System.Text.RegularExpressions;
using Domain.Interfaces.Services;
using Domain.Identity;
using Domain.Interfaces.Repositories;
using API.Models;
using Domain.Entities;
using Services;

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

        [HttpGet("GetEventTypes")]
        public IActionResult GetEventTypes()
        {
            try
            {
                var guestTypes = _guestTypeService.GetGuestTypes();

				var items = guestTypes.Select(e => new GuestTypeViewModel
                {
                    Id = e.Id,
                    Name = e.Name,
                });

                return StatusCode(StatusCodes.Status200OK, items);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
       
    }
}
