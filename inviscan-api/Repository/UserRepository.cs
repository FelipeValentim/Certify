using Domain.Entities;
using Infrastructure.Context;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Repository.Interfaces;

namespace Repository
{
    public class UserProfileRepository :  RepositoryBase<InviScanDbContext, UserProfile>, IUserProfileRepository
    {
        public UserProfileRepository(InviScanDbContext context) : base(context)
        {
        }

        public UserProfile Login(string email, string password)
        {
            UserProfile user = Get(x => x.Email.ToUpper() == email.ToUpper());

            if (user != null)
            {
                var isCorrect = Hash.VerifyPassword(password, user.PasswordHash);

                if (isCorrect)
                {
                    return user;
                }
            }

            return null;
        }
    }
}