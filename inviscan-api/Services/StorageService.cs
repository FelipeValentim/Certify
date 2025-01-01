using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Entities;
using Domain.Interfaces.Services;
using Domain.Identity;
using System.Security.Policy;

namespace Services
{
    public class StorageService : IStorageService
	{
		public void UploadFile(Stream stream)
        {
        }

		public string UploadFile(string base64, Guid eventId, Guid guestId)
		{
			// 1. Verifica se a string base64 é válida
			if (string.IsNullOrWhiteSpace(base64))
				throw new ArgumentException("Base64 string is required.");

			// 2. Remove o prefixo (caso exista)
			var base64Data = base64;
			if (base64Data.Contains(","))
				base64Data = base64Data.Split(',')[1];

			// 3. Converte para bytes
			var imageBytes = Convert.FromBase64String(base64Data);

			// 4. Define o caminho para salvar a imagem
			var fileName = $"photo.png"; // Gera um nome único
			var relativePath = $"/storage/{eventId}/{guestId}/{fileName}";
			var path = Path.Combine("storage", eventId.ToString(), guestId.ToString(), fileName);

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
