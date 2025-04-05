using Domain.DTO;
using Domain.Interfaces.Repositories;
using Domain.Interfaces.Services;
using Services.Helper;
using System.Net;

namespace Services
{
    public class FormService : IFormService
    {
        private readonly IEventRepository _eventRepository;
        private readonly IEventService _eventService;
        private readonly IGuestService _guestService;
        private readonly IMappingService _mappingService;

        public FormService(IEventRepository eventRepository, IEventService eventService, IGuestService guestService, IMappingService mappingService)
        {
            _eventRepository = eventRepository;
            _eventService = eventService;
            _guestService = guestService;
            _mappingService = mappingService;
        }

        public object AddGuest(GuestDTO model)
        {

            _guestService.SetStudentGuestType(ref model);

            var response = _guestService.Add(model, true);

            return response;
        }

        public ResponseModel<EventDTO> GenerateRegistrationForm(string eventId)
        {
            try
            {

                var id = new Guid(eventId);

                if (id == Guid.Empty)
                {
                    return ResponseModel<EventDTO>.Error(HttpStatusCode.NotFound, "Evento inválido.");
                }

                var eventItem = _eventRepository.Get(x => x.Id == id, includeProperties: "User");

                if (eventItem == null)
                {
                    return ResponseModel<EventDTO>.Error(HttpStatusCode.NotFound, "Evento não existe");
                }

                if (DateTime.UtcNow.ConvertToBrazilTime() > eventItem.Date.Add(eventItem.StartTime))
                {
                    return ResponseModel<EventDTO>.Error(HttpStatusCode.BadRequest, "Prazo de cadastro para o evento finalizado.");
                }

                if (eventItem.Pax.HasValue)
                {
                    if (_eventService.CountGuests(eventItem.Id) >= eventItem.Pax)
                    {
                        return ResponseModel<EventDTO>.Error(HttpStatusCode.BadRequest, "Não há mais convites disponíveis para o evento.");
                    }
                }

                var dto = _mappingService.Map<EventDTO>(eventItem);

                return ResponseModel<EventDTO>.Success(dto);
            }
            catch (Exception ex)
            {
                return ResponseModel<EventDTO>.Error(HttpStatusCode.InternalServerError, ex.Message);

            }
        }

        public ResponseModel<EventDTO> GenerateCheckinForm(string eventId)
        {
            try
            {

                var id = new Guid(eventId);

                if (id == Guid.Empty)
                {
                    return ResponseModel<EventDTO>.Error(HttpStatusCode.NotFound, "Evento inválido.");
                }

                var eventItem = _eventRepository.Get(x => x.Id == id, includeProperties: "User");

                if (eventItem == null)
                {
                    return ResponseModel<EventDTO>.Error(HttpStatusCode.NotFound, "Evento não existe");
                }

                if (eventItem.CheckinEnabled == false)
                {
                    return ResponseModel<EventDTO>.Error(HttpStatusCode.BadGateway, "Evento não está disponível para checkin");
                }

                if (eventItem.CheckinEnabled == null)
                {
                    if (DateTime.UtcNow.ConvertToBrazilTime() < eventItem.Date.Add(eventItem.StartTime))
                    {
                        return ResponseModel<EventDTO>.Error(HttpStatusCode.BadRequest, "Evento ainda não começou.");
                    }

                    if (DateTime.UtcNow.ConvertToBrazilTime() > eventItem.Date.Add(eventItem.EndTime))
                    {
                        return ResponseModel<EventDTO>.Error(HttpStatusCode.BadRequest, "Evento já finalizado.");
                    }
                }

                var dto = _mappingService.Map<EventDTO>(eventItem);


                return ResponseModel<EventDTO>.Success(dto);
            }
            catch (Exception ex)
            {
                return ResponseModel<EventDTO>.Error(HttpStatusCode.BadRequest, ex.Message);

            }

        }

        public string CheckinGuest(string accesscode)
        {
            var response = _guestService.Checkin(accesscode, true);

            return response;
        }
    }
}
