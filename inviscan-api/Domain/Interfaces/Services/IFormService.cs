using Domain.DTO;

namespace Domain.Interfaces.Services
{
	public interface IFormService
	{
		ResponseModel<EventDTO> GenerateForm(Guid eventId);
	}
}
