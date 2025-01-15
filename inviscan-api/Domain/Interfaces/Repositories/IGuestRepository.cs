using Domain.Entities;


namespace Domain.Interfaces.Repositories
{
    public interface IGuestRepository : IAuditableRepository<Guest>
    {
        IEnumerable<Guest> GetGuests(Guid eventId);
        bool Exists(Guid eventId, string email);
	}
}
