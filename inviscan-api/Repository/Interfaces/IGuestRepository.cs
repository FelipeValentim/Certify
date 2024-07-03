using Domain.Entities;
using Infrastructure.Repositories;


namespace Repository.Interfaces
{
    public interface IGuestRepository : IRepositoryBase<Guest>
    {
        IEnumerable<Guest> GetGuests(Guid eventId);

        void Checkin(Guid id);

        void Checkin(Guid[] id);


        void Uncheckin(Guid id);

        void Uncheckin(Guid[] id);

    }
}
