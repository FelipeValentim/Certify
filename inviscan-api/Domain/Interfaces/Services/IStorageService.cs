using Domain.DTO;

namespace Domain.Interfaces.Services
{
	public interface IStorageService
	{
        string UploadFile(FileDTO file, string path);

		string UploadTemplate(FileDTO file, Guid eventId);


	}
}
