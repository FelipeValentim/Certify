using Domain.Dto;

namespace Domain.Interfaces.Services
{
    public interface IEventService
	{
		ResponseModel SaveTemplate(FileDto file, Guid eventId);

	}
}
