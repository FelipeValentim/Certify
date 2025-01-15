using Domain.Interfaces.Services;
using HeyRed.Mime;
using Domain.DTO;
using Microsoft.Extensions.Logging;
using System;
using Microsoft.AspNetCore.Hosting;

namespace Services
{
    public class StorageService : IStorageService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        public StorageService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public string UploadFile(FileDTO file, string path)
        {
            path = path.Trim('/');

            // 1. Verifica se a string base64 é válida
            if (string.IsNullOrWhiteSpace(file.Base64))
                throw new ArgumentException("Base64 string is required.");

            // 2. Remove o prefixo (caso exista)
            var base64Data = file.Base64;
            if (base64Data.Contains(","))
                base64Data = base64Data.Split(',')[1];

            // 3. Converte para bytes
            var imageBytes = Convert.FromBase64String(base64Data);

            // 4. Define o caminho para salvar o arquivo
            var extension = MimeTypesMap.GetExtension(file.MimeType);
            string guid = Guid.NewGuid().ToString("N");

            var fileName = $"{guid}.{extension}"; // Gera um nome único
            var relativePath = $"/storage/{path}/{fileName}";

            var filePath = Path.Combine(_webHostEnvironment.WebRootPath, relativePath.Trim('/'));

            // 5. Certifica-se que o diretório existe
            var directory = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            // 6. Salva os bytes no arquivo
            File.WriteAllBytes(filePath, imageBytes);

            // 7. Retorna o caminho relativo da imagem
            return relativePath;
        }

        public string UploadTemplate(FileDTO file, Guid eventId)
        {
            // 1. Verifica se a string base64 é válida
            if (string.IsNullOrWhiteSpace(file.Base64))
                throw new ArgumentException("Base64 string is required.");

            // 2. Remove o prefixo (caso exista)
            var base64Data = file.Base64;
            if (base64Data.Contains(","))
                base64Data = base64Data.Split(',')[1];

            // 3. Converte para bytes
            var imageBytes = Convert.FromBase64String(base64Data);



            // 4. Define o caminho para salvar o arquivo
            var extension = MimeTypesMap.GetExtension(file.MimeType);
            var fileName = $"template.{extension}"; // Gera um nome único
            var relativePath = $"/storage/{eventId}/{fileName}";
            var path = Path.Combine("storage", eventId.ToString(), fileName);

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", path);

            // 5. Certifica-se que o diretório existe
            var directory = Path.GetDirectoryName(filePath);
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            // 6. Salva os bytes no arquivo
            File.WriteAllBytes(filePath, imageBytes);

            // 7. Retorna o caminho relativo da imagem
            return relativePath;
        }
    }
}
