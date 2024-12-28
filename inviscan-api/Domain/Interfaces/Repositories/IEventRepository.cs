using Domain.Entities;


namespace Domain.Interfaces.Repositories
{
    public interface IEventRepository : IAuditableRepository<Event>
    {
		IEnumerable<Event> GetEvents(Guid userId);

        Event GetEventWithGuests(Guid eventId);

    }
}
