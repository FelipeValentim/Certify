using Domain.DTO;
using Domain.Entities;

namespace Domain.Interfaces.Services
{
    public interface IEventService
	{
        ResponseModel<object> Add(EventDTO model);

		ResponseModel<FileDTO> DownloadCertificates(Guid eventId);

		ResponseModel SendCertificates(Guid eventId);

		Event Get(Guid id);

		int CountGuests(Guid eventId);

	}
}
