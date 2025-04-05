using Domain.DTO;

namespace Domain.Interfaces.Services
{
	public interface IFormService
	{
		ResponseModel<EventDTO> GenerateRegistrationForm(string eventId);
        ResponseModel<EventDTO> GenerateCheckinForm(string eventId);

        object AddGuest(GuestDTO model);
        string CheckinGuest(string accesscode);
    }
}
