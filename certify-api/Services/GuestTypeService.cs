using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Spire.Doc;
using System.Xml.Linq;

namespace Services
{
	public class GuestTypeService : IGuestTypeService
	{
		private readonly IGuestTypeRepository _guestTypeRepository;
		public GuestTypeService(IGuestTypeRepository guestTypeRepository)
		{
			_guestTypeRepository = guestTypeRepository;
		}

		public IEnumerable<GuestType> GetAll()
		{
			return _guestTypeRepository.GetAll();
		}

		public GuestType GetGuestTypeByName(string name)
		{
			return _guestTypeRepository.Get(x => x.Name == name);
		}

		public GuestType GetGuestTypeById(Guid id)
		{
			return _guestTypeRepository.GetByID(id);
		}
	}
}
