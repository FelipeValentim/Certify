using Microsoft.AspNetCore.Mvc;
using static event_checkin_api.Models.AccountModels;

namespace event_checkin_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        [HttpPost("Login")]
        public IActionResult Login(AccountUser user)
        {
            return StatusCode(StatusCodes.Status200OK, user);
        }
    }
}
