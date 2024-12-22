using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;
using static API.Models.AccountModels;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ITokenService _tokenService;

        public AccountController(IUserService userService, ITokenService tokenService)
        {
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost("Login")]
        public IActionResult Login(AccountUser model)
        {
            try
            { 
                var user = _userService.Login(model.Email, model.Password);

                if (user == null)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Usuário ou senha incorreto.");
                }

                var token = _tokenService.GenerateToken(user);

                return StatusCode(StatusCodes.Status200OK, token);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
