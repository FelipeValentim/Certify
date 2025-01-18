using Domain.Entities;

namespace Domain.Interfaces.Services
{
    public interface IGuestTypeService
	{
        IEnumerable<GuestType> GetAll();
		GuestType GetGuestTypeByName(string name);
		GuestType GetGuestTypeById(Guid id);


	}
}
