using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces.Services;
using API.Models;

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
