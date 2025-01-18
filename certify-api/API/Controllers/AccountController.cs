using API.Models;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly IUserService _userService;

        public AccountController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("Login")]
        public IActionResult Login(AccountViewModel model)
        {
            var response = _userService.Login(model.Email, model.Password);

            return StatusCode(response.Code, response.Data);
        }
    }
}
