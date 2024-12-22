using Domain.Entities;


namespace Domain.Interfaces.Repositories
{
    public interface IGuestRepository : IRepositoryBase<Guest>
    {
        IEnumerable<Guest> GetGuests(Guid eventId);

        void Checkin(Guid id);

        void Checkin(Guid[] id);


        void Uncheckin(Guid id);

        void Uncheckin(Guid[] id);


        void DeleteGuest(Guid id);
        void DeleteGuests(Guid[] ids);

    }
}
