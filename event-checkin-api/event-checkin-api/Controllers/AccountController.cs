using event_checkin_api.Database;
using event_checkin_api.Services;
using Microsoft.AspNetCore.Mvc;
using static event_checkin_api.Models.AccountModels;

namespace event_checkin_api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserRepository _userRepository;
        public AccountController(UserRepository userRepository) 
        { 
            _userRepository = userRepository;    
        }

        [HttpPost("Login")]
        public IActionResult Login(AccountUser model)
        {
            var user = _userRepository.Login(model.Email, model.Password);

            if (user == null)
            {
                return StatusCode(StatusCodes.Status400BadRequest, "Usuário ou senha incorreto.");
            }

            var token = TokenService.GenerateToken(user);

            return StatusCode(StatusCodes.Status200OK, token);
        }
    }
}
