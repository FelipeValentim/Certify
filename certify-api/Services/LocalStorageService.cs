using Domain.Interfaces.Services;
using HeyRed.Mime;
using Domain.DTO;

namespace Services
{
    public class LocalStorageService : IStorageService
    {
        public async Task<string> UploadFile(FileDTO file)
        {
            if ((file.Data == null || file.Data.Length == 0) && string.IsNullOrWhiteSpace(file.Base64))
                throw new ArgumentException("Base64 string or byte array is required.");

            byte[] data;

            if (file.Data != null && file.Data.Length > 0)
            {
                data = file.Data;
            }
            else
            {
                var base64Data = file.Base64;
                if (base64Data.Contains(","))
                    base64Data = base64Data.Split(',')[1];
                data = Convert.FromBase64String(base64Data);
            }

            var version = DateTime.UtcNow.Ticks;
            var extension = MimeTypesMap.GetExtension(file.MimeType);
            var fileName = $"{Guid.NewGuid():N}_v{version}.{extension}";
            var path = $"/storage/{file.Path.TrimEnd('/')}/{fileName}";

            var localDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "storage", file.Path.TrimEnd('/'));
            if (!Directory.Exists(localDir)) Directory.CreateDirectory(localDir);
            await File.WriteAllBytesAsync(Path.Combine(localDir, fileName), data);

            return path;
        }

        public async Task<Stream> GetFileStream(string path)
        {
            var localPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", path.TrimStart('/'));
            if (File.Exists(localPath)) return new FileStream(localPath, FileMode.Open, FileAccess.Read);
            
            return null;
        }
    }
}
