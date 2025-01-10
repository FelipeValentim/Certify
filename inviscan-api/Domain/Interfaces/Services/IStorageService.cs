using Domain.DTO;

namespace Domain.Interfaces.Services
{
	public interface IStorageService
	{
		string UploadFile(Stream stream, Guid eventId);
		string UploadFile(string base64, Guid eventId, Guid guestId);

		string UploadFile(FileDTO file, Guid eventId);


	}
}
