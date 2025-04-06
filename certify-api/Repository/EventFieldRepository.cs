using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Repository
{
    public class EventFieldRepository :  AuditableRepository<EventField>, IEventFieldRepository
    {
        public EventFieldRepository(CertifyDbContext context) : base(context)
        {
        }
    }
}