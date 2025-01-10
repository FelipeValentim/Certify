using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IEventTemplateService
	{
		ResponseModel UploadTemplate(FileDTO file, Guid eventId);

		ResponseModel RemoveTemplate(Guid eventId);
	}
}
