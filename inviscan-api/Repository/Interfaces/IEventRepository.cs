using Domain.Entities;
using Infrastructure.Repositories;


namespace Repository.Interfaces
{
    public interface IEventRepository : IRepositoryBase<Event>
    {
        IEnumerable<Event> GetEvents(string userId);
    }
}
