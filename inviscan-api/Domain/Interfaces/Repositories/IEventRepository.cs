using Domain.Entities;


namespace Domain.Interfaces.Repositories
{
    public interface IEventRepository : IRepositoryBase<Event>
    {
        IEnumerable<Event> GetEvents(Guid userId);

        Event GetEventWithGuests(Guid eventId);

    }
}
