using Domain.DTO;
using Domain.Entities;
using Domain.Exceptions;
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

        public string Login(string email, string password)
        {
            UserProfile user = _userProfileRepository.Get(x => x.Email.ToUpper() == email.ToUpper());

            if (user != null)
            {
                var isCorrect = _hashService.VerifyPassword(password, user.PasswordHash);

                if (isCorrect)
                {
                    var token = _tokenService.GenerateToken(user);

                    return token;
                }
            }

            throw new UnauthorizedException("Usuário ou senha incorreto.");
        }
    }
}
