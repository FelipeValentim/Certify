namespace Domain.Interfaces.Services
{
	public interface IStorageService
	{
		void UploadFile(Stream stream);
		string UploadFile(string base64, Guid eventId, Guid guestId);

	}
}
