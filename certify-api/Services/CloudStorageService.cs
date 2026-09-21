using Domain.Interfaces.Services;
using HeyRed.Mime;
using Domain.DTO;
using Amazon.S3;
using Amazon.S3.Model;

namespace Services
{
    public class CloudStorageService : IStorageService
    {
        private static string accountId = Environment.GetEnvironmentVariable("STORAGE_ACCOUNT_ID");
        private static string accessKeyId = Environment.GetEnvironmentVariable("STORAGE_ACCESS_KEY_ID");
        private static string secretAccessKey = Environment.GetEnvironmentVariable("STORAGE_SECRET_ACCESS_KEY");
        private static string bucketName = Environment.GetEnvironmentVariable("STORAGE_BUCKET_NAME");
        private static string endpoint = $"https://{accountId}.r2.cloudflarestorage.com";

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

            var config = new AmazonS3Config
            {
                ServiceURL = endpoint,
            };

            using (var client = new AmazonS3Client(accessKeyId, secretAccessKey, config))
            {
                var request = new PutObjectRequest
                {
                    BucketName = bucketName,
                    Key = path.Trim('/'),
                    InputStream = new MemoryStream(data),
                    ContentType = file.MimeType,
                    DisablePayloadSigning = true,
                };

                await client.PutObjectAsync(request);
            }

            return path;
        }

        public async Task<Stream> GetFileStream(string path)
        {
            var obj = new GetObjectResponse();

            var config = new AmazonS3Config
            {
                ServiceURL = endpoint,
            };

            using (var client = new AmazonS3Client(accessKeyId, secretAccessKey, config))
            {
                var request = new GetObjectRequest
                {
                    BucketName = bucketName,
                    Key = path.Trim('/'),
                };

                obj = await client.GetObjectAsync(request);
            }

            return obj.ResponseStream;
        }
    }
}
