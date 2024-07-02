using Domain.Entities;
using Infrastructure.Repositories;


namespace Repository.Interfaces
{
    public interface IGuestRepository : IRepositoryBase<Guest>
    {
        IEnumerable<Guest> GetGuests(int eventId);

        void Checkin(int id);

        void Uncheckin(int id);

    }
}
