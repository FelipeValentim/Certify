using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IUserService
    {
        ResponseModel Login(string email, string password);
    }
}
