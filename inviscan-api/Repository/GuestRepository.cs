using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Repository
{
	public class GuestRepository : AuditableRepository<InviScanDbContext, Guest>, IGuestRepository
	{
		public GuestRepository(InviScanDbContext context) : base(context)
		{
		}

		public IEnumerable<Guest> GetGuests(Guid eventId)
		{
			return GetAll(x => x.EventId == eventId && x.DateDeleted.HasValue == false);
		}

		public void Checkin(Guid[] ids)
		{
			var guests = GetAll(x => ids.Any(id => x.Id == id));

			foreach (var guest in guests)
			{
				guest.DateCheckin = DateTime.Now;

				Update(guest);
			}
		}

		public void Checkin(Guid id)
		{
			var guest = GetByID(id);

			if (guest != null)
			{
				guest.DateCheckin = DateTime.Now;

				Update(guest);
			}
		}


		public void Uncheckin(Guid[] ids)
		{
			var guests = GetAll(x => ids.Any(id => x.Id == id));

			foreach (var guest in guests)
			{
				guest.DateCheckin = null;

				Update(guest);
			}
		}

		public void Uncheckin(Guid id)
		{
			var guest = GetByID(id);

			if (guest != null)
			{
				guest.DateCheckin = null;

				Update(guest);
			}
		}

	}
}