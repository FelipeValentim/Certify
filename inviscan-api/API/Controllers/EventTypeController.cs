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
    public class EventTypeController : ControllerBase
    {
        private readonly IEventTypeService _eventTypeService;
        public EventTypeController(IEventTypeService eventTypeService)
        {
			_eventTypeService = eventTypeService;
    
        }

        [HttpGet("GetEventTypes")]
        public IActionResult GetEventTypes()
        {
            try
            {
				var eventTypes = _eventTypeService.GetAll();

				var items = eventTypes.Select(e => new EventTypeViewModel
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
