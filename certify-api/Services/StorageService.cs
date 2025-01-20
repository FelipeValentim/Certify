using Domain.Interfaces.Services;
using HeyRed.Mime;
using Domain.DTO;
using Microsoft.Extensions.Logging;
using System;
using Microsoft.AspNetCore.Hosting;
using Amazon.Runtime;
using Amazon.S3.Transfer;
using Amazon.S3;
using Amazon.S3.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Services
{
    public class StorageService : IStorageService
    {
        static string accountId = "931021e23fec1bc200c669d34b824b7b";  // Sua chave de acesso
        static string accessKeyId = "d30dec3021dc4e5447c8f7d91e98d749";
        static string secretAccessKey = "378692d5fd876995887228fbbb031299f41ac081f02018b110986adbcd4b2a9a";  // Sua chave secreta
        static string bucketName = "certify";  // Nome do seu bucket R2
        static string endpoint = $"https://{accountId}.r2.cloudflarestorage.com";  // Endpoint do seu R2 (substitua <account_id> pelo seu ID de conta)

        public async Task<string> UploadFile(FileDTO file, string path)
        {
            // 1. Verifica se a string base64 é válida
            if (string.IsNullOrWhiteSpace(file.Base64))
                throw new ArgumentException("Base64 string is required.");

            // 2. Remove o prefixo (caso exista)
            var base64Data = file.Base64;
            if (base64Data.Contains(","))
                base64Data = base64Data.Split(',')[1];


            // 3. Converte para bytes
            var data = Convert.FromBase64String(base64Data);

            // 4. Define o caminho para salvar o arquivo
            var extension = MimeTypesMap.GetExtension(file.MimeType);
            string guid = Guid.NewGuid().ToString("N");

            var fileName = $"{guid}.{extension}"; // Gera um nome único
            var relativePath = $"/storage/{path}/{fileName}";

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
                    Key = relativePath.Trim('/'),
                    InputStream = new MemoryStream(data),
                    ContentType = file.MimeType,
                    DisablePayloadSigning = true,
                };


                // Faça o upload do arquivo
                await client.PutObjectAsync(request);

            }

            // 7. Retorna o caminho relativo da imagem
            return relativePath;
        }

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
                    Key = file.Path.Trim('/'),
                    InputStream = new MemoryStream(data),
                    ContentType = file.MimeType,
                    DisablePayloadSigning = true,
                };


                // Faça o upload do arquivo
                await client.PutObjectAsync(request);

            }

            // 7. Retorna o caminho relativo da imagem
            return file.Path;
        }

        public async Task<string> UploadTemplate(FileDTO file, Guid eventId)
        {
            // 1. Verifica se a string base64 é válida
            if (string.IsNullOrWhiteSpace(file.Base64))
                throw new ArgumentException("Base64 string is required.");

            // 2. Remove o prefixo (caso exista)
            var base64Data = file.Base64;
            if (base64Data.Contains(","))
                base64Data = base64Data.Split(',')[1];

            // 3. Converte para bytes
            var data = Convert.FromBase64String(base64Data);

            // 4. Define o caminho para salvar o arquivo
            var extension = MimeTypesMap.GetExtension(file.MimeType);
            var fileName = $"template.{extension}"; // Gera um nome único
            var relativePath = $"/storage/{eventId}/{fileName}";
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
                    Key = relativePath.Trim('/'),
                    InputStream = new MemoryStream(data),
                    ContentType = file.MimeType,
                    DisablePayloadSigning = true,
                };

                // Faça o upload do arquivo
                await client.PutObjectAsync(request);

            }

            // 7. Retorna o caminho relativo da imagem
            return relativePath;
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
