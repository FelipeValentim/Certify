using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Repository
{
    public class EventTypeRepository :  Repository<InviScanDbContext, EventType>, IEventTypeRepository
    {
        public EventTypeRepository(InviScanDbContext context) : base(context)
        {
        }
    }
}