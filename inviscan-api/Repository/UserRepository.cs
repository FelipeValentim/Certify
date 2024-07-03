using Domain.Entities;
using Infrastructure.Context;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Repository.Interfaces;

namespace Repository
{
    public class UserRepository :  RepositoryBase<InviScanDbContext, User>, IUserRepository
    {
        public UserRepository(InviScanDbContext context) : base(context)
        {
        }

        public User Login(string email, string password)
        {
            User user = Get(x => x.Email.ToUpper() == email.ToUpper());

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