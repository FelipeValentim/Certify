using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Domain.Interfaces.Services;
using Domain.DTO;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventTemplateController : ControllerBase
    {
		private readonly IEventTemplateService _eventTemplateService;
		public EventTemplateController(IEventTemplateService eventTemplateService)
        {
			_eventTemplateService = eventTemplateService;

        }

		[HttpPost("Upload/{eventId}")]
		public IActionResult UploadTemplate(FileDTO file, Guid eventId)
        {
            var response = _eventTemplateService.UploadTemplate(file, eventId);
          
			return StatusCode(response.Code, response.Result);
		}

		[HttpDelete("Remove/{eventId}")]
		public IActionResult RemoveTemplate(Guid eventId)
		{
			var response = _eventTemplateService.RemoveTemplate(eventId);

			return StatusCode(response.Code, response.Data);
		}
	}
}
