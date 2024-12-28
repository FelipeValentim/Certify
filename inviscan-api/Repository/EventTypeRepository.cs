using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Repository
{
    public class EventTypeRepository :  Repository<EventType>, IEventTypeRepository
    {
        public EventTypeRepository(InviScanDbContext context) : base(context)
        {
        }
    }
}