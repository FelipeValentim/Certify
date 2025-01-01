using Domain.Entities;


namespace Domain.Interfaces.Repositories
{
    public interface IGuestRepository : IAuditableRepository<Guest>
    {
        IEnumerable<Guest> GetGuests(Guid eventId);

        void Checkin(Guid id);

        void Checkin(Guid[] id);


        void Uncheckin(Guid id);

        void Uncheckin(Guid[] id);
        bool Exists(Guid eventId, string email);
	}
}
