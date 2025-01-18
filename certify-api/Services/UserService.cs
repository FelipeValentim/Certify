using Domain.DTO;
using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using System.Net;

namespace Services
{
    public class UserService : IUserService
    {
        private readonly IUserProfileRepository _userProfileRepository;
        private readonly IHashService _hashService;
        private readonly ITokenService _tokenService;

        public UserService(IUserProfileRepository userProfileRepository, IHashService hashService, ITokenService tokenService)
        {
            _userProfileRepository = userProfileRepository;
            _hashService = hashService;
            _tokenService = tokenService;
        }

        public ResponseModel Login(string email, string password)
        {
            try
            {
                UserProfile user = _userProfileRepository.Get(x => x.Email.ToUpper() == email.ToUpper());

                if (user != null)
                {
                    var isCorrect = _hashService.VerifyPassword(password, user.PasswordHash);

                    if (isCorrect)
                    {
                        var token = _tokenService.GenerateToken(user);

                        return ResponseModel.Success(token);
                    }
                }

                return ResponseModel.Error(HttpStatusCode.Unauthorized, "Usuário ou senha incorreto.");
            }
            catch (Exception ex)
            {
                return ResponseModel.Error(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
