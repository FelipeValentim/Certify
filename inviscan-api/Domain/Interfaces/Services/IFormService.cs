using Domain.DTO;

namespace Domain.Interfaces.Services
{
	public interface IFormService
	{
		ResponseModel<EventDTO> GenerateRegistrationForm(string eventId);
        ResponseModel<EventDTO> GenerateCheckinForm(string eventId);

        ResponseModel<object> AddGuest(GuestDTO model);

    }
}
