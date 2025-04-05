using Domain.DTO;
using Domain.Entities;

namespace Domain.Interfaces.Services
{
    public interface IEventTemplateService
	{
        EventTemplate Get(Guid id);

        void UploadTemplate(FileDTO file, Guid eventId);

        void RemoveTemplate(Guid eventId);
	}
}
