using Domain.Interfaces.Services;
using HeyRed.Mime;
using Domain.DTO;
using Amazon.S3;
using Amazon.S3.Model;

namespace Services
{
    public class StorageService : IStorageService
    {
        private static string accountId = "931021e23fec1bc200c669d34b824b7b";  // Sua chave de acesso
        private static string accessKeyId = "d30dec3021dc4e5447c8f7d91e98d749";
        private static string secretAccessKey = "378692d5fd876995887228fbbb031299f41ac081f02018b110986adbcd4b2a9a";  // Sua chave secreta
        private static string bucketName = "certify"; // Nome do seu bucket R2
        private static string endpoint = $"https://{accountId}.r2.cloudflarestorage.com";  // Endpoint do seu R2 (substitua <account_id> pelo seu ID de conta)


        public async Task<string> UploadFile(FileDTO file, string name = null)
        {
            // 1. Verifica se a string base64 é válida
            if ((file.Data == null || file.Data.Length == 0) && string.IsNullOrWhiteSpace(file.Base64))
                throw new ArgumentException("Base64 string or byte array is required.");

            byte[] data;
            string path;

            var extension = MimeTypesMap.GetExtension(file.MimeType);

            if (name != null)
            {
                path = $"/storage/{file.Path.Trim('/')}/{name}.{extension}";
            }
            else
            {
                string guid = Guid.NewGuid().ToString("N");

                path = $"/storage/{file.Path}/{guid}.{extension}";
            }

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
