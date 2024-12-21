using Infrastructure.Services;
using InviScan.Services;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;
using static API.Models.AccountModels;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IUserProfileRepository _userRepository;

        public AccountController(IUserProfileRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpPost("Login")]
        public IActionResult Login(AccountUser model)
        {
            try
            { 
                var user = _userRepository.Login(model.Email, model.Password);

                if (user == null)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Usuário ou senha incorreto.");
                }

                var token = TokenService.GenerateToken(user);

                return StatusCode(StatusCodes.Status200OK, token);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
