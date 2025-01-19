using Domain.DTO;

namespace Domain.Interfaces.Services
{
	public interface IStorageService
	{
        Task<string> UploadFile(FileDTO file, string path);
        Task<string> UploadFile(FileDTO file);
        Task<string> UploadTemplate(FileDTO file, Guid eventId);
        Task<Stream> GetFileStream(string path);
    }
}
