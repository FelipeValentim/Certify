using Domain.Entities;
using Infrastructure.Repositories;


namespace Repository.Interfaces
{
    public interface IUserProfileRepository : IRepositoryBase<UserProfile>
    {
        UserProfile Login(string email, string password);
    }
}
