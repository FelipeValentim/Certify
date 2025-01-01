using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Repository
{
	public class GuestRepository : AuditableRepository<Guest>, IGuestRepository
	{
		public GuestRepository(InviScanDbContext context) : base(context)
		{
		}

		public IEnumerable<Guest> GetGuests(Guid eventId)
		{
			return GetAll(x => x.EventId == eventId, includeProperties: "GuestType");
		}

		public void Checkin(Guid[] ids)
		{
			var guests = GetAll(x => ids.Any(id => x.Id == id));

			foreach (var guest in guests)
			{
				guest.CheckinDate = DateTime.Now;

				Update(guest);
			}
		}

		public void Checkin(Guid id)
		{
			var guest = GetByID(id);

			if (guest != null)
			{
				guest.CheckinDate = DateTime.Now;

				Update(guest);
			}
		}


		public void Uncheckin(Guid[] ids)
		{
			var guests = GetAll(x => ids.Any(id => x.Id == id));

			foreach (var guest in guests)
			{
				guest.CheckinDate = null;

				Update(guest);
			}
		}

		public void Uncheckin(Guid id)
		{
			var guest = GetByID(id);

			if (guest != null)
			{
				guest.CheckinDate = null;

				Update(guest);
			}
		}

		public bool Exists(Guid eventId, string email)
		{
			return Count(x => x.Email.ToLower() == email.ToLower() && x.EventId == eventId) > 0;
		}
	}
}