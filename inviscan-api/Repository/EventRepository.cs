using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Repository
{
    public class EventRepository :  AuditableRepository<InviScanDbContext, Event>, IEventRepository
    {
        public EventRepository(InviScanDbContext context) : base(context)
        {
        }

		public void DeleteEvent(Guid id)
		{
			var entity = GetByID(id);

			if (entity != null)
			{
				entity.DateDeleted = DateTime.Now;

				Update(entity);
			}
		}

		public IEnumerable<Event> GetEvents(Guid userId)
        {
            return GetAll(x => x.UserId == userId && x.DateDeleted.HasValue == false, includeProperties: "EventType");
        }

        public Event GetEventWithGuests(Guid eventId)
        {
            return Get(x => x.Id == eventId, includeProperties: "Guests");
        }
    }
}