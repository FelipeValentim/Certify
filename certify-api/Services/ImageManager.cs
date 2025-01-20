using Domain.DTO;
using Domain.Interfaces.Services;
using Services.Helper;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;

namespace Services
{
    public class ImageManager : IImageManager
    {
        public FileDTO CompressImage(FileDTO file, long maxSize = 1 * 1024 * 1024)
        {
            if (!Array.Exists(new[] { "image/jpeg", "image/png", "image/jpg" }, type => type.Equals(file.MimeType, StringComparison.OrdinalIgnoreCase)))
            {
                throw new Exception("Formato da imagem é inválido.");
            }

            if (file.Size <= maxSize)
            {
                return file;
            }

            // Decodifica a imagem Base64 para um byte array
            var imageData = file.Base64.ConvertToBytes();

            // Carrega a imagem com ImageSharp
            using (var image = Image.Load(imageData))
            {
                // Define a qualidade inicial
                int quality = 90;

                // Define um stream para a imagem comprimida
                using (var outputStream = new MemoryStream())
                {
                    do
                    {
                        outputStream.SetLength(0); // Limpa o stream para nova compressão

                        // Define os parâmetros de qualidade
                        var encoder = GetEncoderByMimeType(file.MimeType, quality);

                        // Salva a imagem no stream com os parâmetros de compressão
                        image.Save(outputStream, encoder);

                        // Se o tamanho da imagem estiver dentro do limite, finaliza
                        if (outputStream.Length <= maxSize || quality <= 10)
                        {
                            break;
                        }

                        // Reduz a qualidade para maior compressão
                        quality -= 10;
                    }
                    while (quality > 10);

                    // Atualiza as informações do arquivo com a imagem comprimida
                    file.Base64 = Convert.ToBase64String(outputStream.ToArray());
                    file.Size = outputStream.Length;
                }
            }

            return file;
        }

        private IImageEncoder GetEncoderByMimeType(string mimeType, int quality)
        {
            if (mimeType.Equals("image/jpeg", StringComparison.OrdinalIgnoreCase) ||
                mimeType.Equals("image/jpg", StringComparison.OrdinalIgnoreCase))
            {
                return new JpegEncoder
                {
                    Quality = quality
                };
            }

            if (mimeType.Equals("image/png", StringComparison.OrdinalIgnoreCase))
            {
                return new PngEncoder
                {
                    CompressionLevel = PngCompressionLevel.BestCompression
                };
            }

            throw new Exception("Formato da imagem não é suportado para compressão.");
        }
    }
}
