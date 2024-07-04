using Domain.Entities;
using Infrastructure.Context;
using Infrastructure.Repositories;
using Repository.Interfaces;

namespace Repository
{
    public class GuestRepository : RepositoryBase<InviScanDbContext, Guest>, IGuestRepository
    {
        public GuestRepository(InviScanDbContext context) : base(context)
        {
        }

        public IEnumerable<Guest> GetGuests(Guid eventId)
        {
            return GetAll(x => x.EventId == eventId);
        }

        public void Checkin(Guid[] ids)
        {
            foreach (var id in ids)
            {
                var guest = GetByID(id);

                if (guest != null)
                {
                    guest.DateCheckin = DateTime.Now;

                    Update(guest);
                }
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
            foreach (var id in ids)
            {
                var guest = GetByID(id);

                if (guest != null)
                {
                    guest.DateCheckin = null;

                    Update(guest);
                }
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

        public void DeleteGuest(Guid id)
        {
            var guest = GetByID(id);

            if (guest != null)
            {
                guest.IsDeleted = true;

                Update(guest);
            }
        }

        public void DeleteGuests(Guid[] ids)
        {
            foreach (var id in ids)
            {
                var guest = GetByID(id);

                if (guest != null)
                {
                    guest.IsDeleted = true;

                    Update(guest);
                }
            }
        }


    }
}