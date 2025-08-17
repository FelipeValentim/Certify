using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class EventFieldController : ControllerBase
    {
        private readonly IEventFieldService _eventFieldService;

        public EventFieldController(IEventFieldService eventFieldService)
        {
            _eventFieldService = eventFieldService;
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            _eventFieldService.Delete(id);

            return StatusCode(StatusCodes.Status200OK, "Campo dinâmico deletado com sucesso");
        }
    }
}
