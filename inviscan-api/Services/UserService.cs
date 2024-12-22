using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;

namespace Services
{
    public class UserService : IUserService
    {
        private readonly IUserProfileRepository _userProfileRepository;
        private readonly IHashService _hashService;
        public UserService(IUserProfileRepository userProfileRepository, IHashService hashService) 
        {
            _userProfileRepository = userProfileRepository;
            _hashService = hashService;
        }

        public UserProfile Login(string email, string password)
        {
            UserProfile user = _userProfileRepository.Get(x => x.Email.ToUpper() == email.ToUpper());

            if (user != null)
            {
                var isCorrect = _hashService.VerifyPassword(password, user.PasswordHash);

                if (isCorrect)
                {
                    return user;
                }
            }

            return null;
        }
    }
}
