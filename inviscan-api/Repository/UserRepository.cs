using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Repository
{
    public class UserProfileRepository :  Repository<UserProfile>, IUserProfileRepository
    {
        public UserProfileRepository(InviScanDbContext context) : base(context)
        {
        }
    }
}