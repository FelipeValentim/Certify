using Domain.Entities;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Spire.Doc;

namespace Services
{
	public class EventTypeService : IEventTypeService
	{
		private readonly IEventTypeRepository _eventTypeRepository;
		public EventTypeService(IEventTypeRepository eventTypeRepository)
		{
			_eventTypeRepository = eventTypeRepository;
		}

		public IEnumerable<EventType> GetEventTypes()
		{
			return _eventTypeRepository.GetAll();
		}
	}
}
