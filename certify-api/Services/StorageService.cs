using Domain.Interfaces.Services;
using HeyRed.Mime;
using Domain.DTO;
using Amazon.S3;
using Amazon.S3.Model;
using System.Xml.Linq;

namespace Services
{
    public class StorageService : IStorageService
    {
        private static string accountId = Environment.GetEnvironmentVariable("STORAGE_ACCOUNT_ID");  // Sua chave de acesso
        private static string accessKeyId = Environment.GetEnvironmentVariable("STORAGE_ACCESS_KEY_ID");
        private static string secretAccessKey = Environment.GetEnvironmentVariable("STORAGE_SECRET_ACCESS_KEY");  // Sua chave secreta
        private static string bucketName = Environment.GetEnvironmentVariable("STORAGE_BUCKET_NAME"); // Nome do seu bucket R2
        private static string endpoint = $"https://{accountId}.r2.cloudflarestorage.com";  // Endpoint do seu R2 (substitua <account_id> pelo seu ID de conta)


        public async Task<string> UploadFile(FileDTO file)
        {
            // 1. Verifica se a string base64 é válida
            if ((file.Data == null || file.Data.Length == 0) && string.IsNullOrWhiteSpace(file.Base64))
                throw new ArgumentException("Base64 string or byte array is required.");

            byte[] data;

            // 2. Caso o array de bytes esteja disponível, use-o
            if (file.Data != null && file.Data.Length > 0)
            {
                data = file.Data;
            }
            else
            {
                var base64Data = file.Base64;

                // Remove o prefixo (caso exista)
                if (base64Data.Contains(","))
                    base64Data = base64Data.Split(',')[1];

                // Converte a base64 para bytes
                data = Convert.FromBase64String(base64Data);
            }

            // 3. Gera nome único com base em ticks (ou pode usar Guid se preferir)
            var version = DateTime.UtcNow.Ticks;
            var extension = MimeTypesMap.GetExtension(file.MimeType);
            var fileName = $"{Guid.NewGuid():N}_v{version}.{extension}";
            var path = $"/storage/{file.Path.TrimEnd('/')}/{fileName}";

            // Configure o cliente S3
            var config = new AmazonS3Config
            {
                ServiceURL = endpoint,
                //ForcePathStyle = true,  // Necessário para o R2
            };

            using (var client = new AmazonS3Client(accessKeyId, secretAccessKey, config))
            {
                // Crie o transfer utility para upload
                var request = new PutObjectRequest
                {
                    BucketName = bucketName,
                    Key = path.Trim('/'),
                    InputStream = new MemoryStream(data),
                    ContentType = file.MimeType,
                    DisablePayloadSigning = true,
                };


                // Faça o upload do arquivo
                await client.PutObjectAsync(request);
            }

            // 7. Retorna o caminho relativo da imagem
            return path;
        }

        public async Task<Stream> GetFileStream(string path)
        {
            var obj = new GetObjectResponse();

            // Configure o cliente S3
            var config = new AmazonS3Config
            {
                ServiceURL = endpoint,
                //ForcePathStyle = true,  // Necessário para o R2
            };

            using (var client = new AmazonS3Client(accessKeyId, secretAccessKey, config))
            {
                // Crie o transfer utility para upload
                var request = new GetObjectRequest
                {
                    BucketName = bucketName,
                    Key = path.Trim('/'),
                };

                // Faça o upload do arquivo
                obj = await client.GetObjectAsync(request);

            }

            // 7. Retorna o caminho relativo da imagem
            return obj.ResponseStream;
        }
    }
}
