using Domain.Entities;
using System.Linq.Expressions;


namespace Domain.Interfaces.Repositories
{
    public interface IGuestRepository : IAuditableRepository<Guest>
    {
        IEnumerable<Guest> GetGuests(Guid eventId);
        bool Exists(Guid eventId, string email);
        IEnumerable<Guest> GetAllRelated(Expression<Func<Guest, bool>> filter = null);
    }
}
