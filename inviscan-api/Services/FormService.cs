using Domain.DTO;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Hosting;
using Spire.Doc;
using System.Net;
using Xceed.Words.NET;

namespace Services
{
    public class  FormService : IFormService
    {
		private readonly IEventRepository _eventRepository;

		public FormService(IEventRepository eventRepository)
		{
			_eventRepository = eventRepository;
		}

		public ResponseModel<EventDTO> GenerateForm(string eventId)
		{
			var id = new Guid(eventId);

            if (id == Guid.Empty)
            {
                return ResponseModel<EventDTO>.Error(HttpStatusCode.NotFound, "Evento inválido.");
            }

            var eventItem = _eventRepository.Get(x => x.Id == id, includeProperties: "User");

			if (eventItem == null)
			{
				return ResponseModel<EventDTO>.Error(HttpStatusCode.NotFound ,"Evento não existe");
			}

			var item = new EventDTO
			{
				Id = eventItem.Id,
				Date = eventItem.Date,
				StartTime = eventItem.StartTime,
				EndTime = eventItem.EndTime,
				Name = eventItem.Name,
				Photo = eventItem.Photo,
				User = new UserDTO
				{
					Id = eventItem.User.Id,
					Name = eventItem.User.Name,
				}
			};

			return ResponseModel<EventDTO>.Success(item);
		}
	}
}
