using Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Repository;
using static API.Models.AccountModels;

namespace API.Controllers
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
