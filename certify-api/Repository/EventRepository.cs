using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Repository
{
    public class EventRepository :  AuditableRepository<Event>, IEventRepository
    {
        public EventRepository(CertifyDbContext context) : base(context)
        {
        }

		public void DeleteEvent(Guid id)
		{
			var entity = GetByID(id);

			if (entity != null)
			{
				entity.DeletedDate = DateTime.UtcNow;

				Update(entity);
			}
		}

		public IEnumerable<Event> GetEvents(Guid userId)
        {
            return GetAll(x => x.UserId == userId, includeProperties: "EventType");
        }

        public Event GetEventWithGuests(Guid eventId)
        {
            return Get(x => x.Id == eventId, includeProperties: "Guests");
        }
    }
}