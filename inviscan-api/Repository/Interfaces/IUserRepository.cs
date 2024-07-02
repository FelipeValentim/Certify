using Domain.Entities;
using Infrastructure.Repositories;


namespace Repository.Interfaces
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        User Login(string email, string password);
    }
}
