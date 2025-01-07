using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Repository
{
    public class EventTemplateRepository :  AuditableRepository<EventTemplate>, IEventTemplateRepository
	{
        public EventTemplateRepository(InviScanDbContext context) : base(context)
        {
        }
    }
}