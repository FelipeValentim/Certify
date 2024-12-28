using Domain.Entities;

namespace Domain.Interfaces.Services
{
    public interface IGuestTypeService
	{
        IEnumerable<GuestType> GetGuestTypes();

    }
}
