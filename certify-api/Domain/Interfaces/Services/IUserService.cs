using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IUserService
    {
        string Login(string email, string password);
    }
}
