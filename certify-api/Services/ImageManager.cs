using Domain.DTO;
using Domain.Interfaces.Services;
using Services.Helper;
using System.Drawing;
using System.Drawing.Imaging;

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

            Stream stream = null;

            // Convertendo a Base64 para Stream
            using (var image = Image.FromStream(file.Base64.ConvertToStream()))
            {
                // Ajustar qualidade da imagem
                var quality = 90L; // Começa com 90%
                var encoderParameters = new EncoderParameters(1);
                var encoder = GetEncoderByMimeType(file.MimeType); // Obter encoder com base no MimeType
                if (encoder == null)
                {
                    return file; // Retorna o arquivo original se o encoder não for encontrado
                }

                // Criando o stream fora do bloco 'using' para evitar o erro de stream fechado
                using (var compressStream = new MemoryStream())
                {
                    do
                    {
                        encoderParameters.Param[0] = new EncoderParameter(Encoder.Quality, quality);

                        // Salvar imagem com a qualidade ajustada
                        image.Save(compressStream, encoder, encoderParameters);

                        // Se o tamanho do arquivo comprimido for menor ou igual ao limite
                        if (compressStream.Length <= maxSize || quality <= 10)
                        {
                            // Salvar o conteúdo do compressStream em stream
                            stream = new MemoryStream(compressStream.ToArray());
                            break;
                        }

                        // Reduzir a qualidade para mais compressão
                        quality -= 10;

                        // Limpar o MemoryStream para a próxima compressão
                        compressStream.SetLength(0);

                    } while (quality > 10); // Evitar qualidade muito baixa
                }
            }

            // Atualizar informações do arquivo comprimido
            file.Base64 = stream.ConvertToBase64(); // Converter de volta para Base64

            return file;
        }

        private ImageCodecInfo GetEncoderByMimeType(string mimeType)
        {
            ImageFormat format = null;
            if (mimeType.Equals("image/jpeg", StringComparison.OrdinalIgnoreCase) ||
                mimeType.Equals("image/jpg", StringComparison.OrdinalIgnoreCase))
            {
                format = ImageFormat.Jpeg;
            }
            else if (mimeType.Equals("image/png", StringComparison.OrdinalIgnoreCase))
            {
                format = ImageFormat.Png;
            }

            if (format == null) return null;

            var codecs = ImageCodecInfo.GetImageDecoders();
            foreach (var codec in codecs)
            {
                if (codec.FormatID == format.Guid)
                {
                    return codec;
                }
            }
            return null;
        }
    }
}
