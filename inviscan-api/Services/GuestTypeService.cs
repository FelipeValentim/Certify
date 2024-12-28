using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Spire.Doc;

namespace Services
{
	public class GuestTypeService : IGuestTypeService
	{
		private readonly IGuestTypeRepository _guestTypeRepository;
		public GuestTypeService(IGuestTypeRepository guestTypeRepository)
		{
			_guestTypeRepository = guestTypeRepository;
		}

		public IEnumerable<GuestType> GetGuestTypes()
		{
			return _guestTypeRepository.GetAll();
		}
	}
}
