using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IImageManager
    {
        FileDTO CompressImage(FileDTO file, long maxSize = 1 * 1024 * 1024);

    }
}
