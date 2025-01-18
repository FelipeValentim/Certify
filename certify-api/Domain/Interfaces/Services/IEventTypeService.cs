using Domain.Entities;

namespace Domain.Interfaces.Services
{
    public interface IEventTypeService
    {
        IEnumerable<EventType> GetAll();

    }
}
