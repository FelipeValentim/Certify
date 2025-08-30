using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Repository
{
    public class EventFieldValueRepository :  Repository<EventFieldValue>, IEventFieldValueRepository
    {
        public EventFieldValueRepository(CertifyDbContext context) : base(context)
        {
        }
    }
}