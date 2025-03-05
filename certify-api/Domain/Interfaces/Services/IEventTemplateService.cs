using Domain.DTO;
using Domain.Entities;

namespace Domain.Interfaces.Services
{
    public interface IEventTemplateService
	{
        EventTemplate Get(Guid id);

        ResponseModel UploadTemplate(FileDTO file, Guid eventId);

		ResponseModel RemoveTemplate(Guid eventId);
	}
}
