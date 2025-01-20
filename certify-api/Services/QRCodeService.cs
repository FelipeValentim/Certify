using Domain.DTO;
using Domain.Interfaces.Services;
using QRCoder;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using Microsoft.AspNetCore.Hosting;

namespace Services
{
    public class QRCodeService : IQRCodeService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public QRCodeService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public FileDTO GenerateQRCode(Guid id)
        {
            return GenerateQRCodeInternal(id.ToString());
        }

        public FileDTO GenerateQRCode(string value)
        {
            return GenerateQRCodeInternal(value);
        }

        private FileDTO GenerateQRCodeInternal(string value)
        {
            // Gerar os dados do QR Code
            using (var qrGenerator = new QRCodeGenerator())
            {
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(value, QRCodeGenerator.ECCLevel.Q);

                // Converter QR Code em matriz de pixels
                PngByteQRCode pngByteQRCode = new PngByteQRCode(qrCodeData);
                byte[] qrCodeImage = pngByteQRCode.GetGraphic(20);

                using (var qrCodeImageSharp = Image.Load<Rgba32>(qrCodeImage))
                {
                    string logoPath = Path.Combine(_webHostEnvironment.WebRootPath, "default", "logo.png");

                    if (File.Exists(logoPath))
                    {
                        // Carregar a logo usando ImageSharp
                        using (var logo = Image.Load<Rgba32>(logoPath))
                        {
                            // Redimensionar a logo para 1/5 do tamanho do QR Code
                            int logoSize = qrCodeImageSharp.Width / 5;
                            logo.Mutate(x => x.Resize(logoSize, logoSize));

                            // Combinar a logo no centro do QR Code
                            int x = (qrCodeImageSharp.Width - logoSize) / 2;
                            int y = (qrCodeImageSharp.Height - logoSize) / 2;

                            qrCodeImageSharp.Mutate(ctx => ctx.DrawImage(logo, new Point(x, y), 1f));
                        }
                    }

                    // Salvar o QR Code final como PNG em um MemoryStream
                    using (var ms = new MemoryStream())
                    {
                        qrCodeImageSharp.Save(ms, new PngEncoder());

                        // Retornar o QR Code como um arquivo
                        var file = new FileDTO
                        {
                            MimeType = "image/png",
                            Name = $"{Guid.NewGuid():N}.png",
                            Data = ms.ToArray()
                        };

                        return file;
                    }
                }
            }
        }
    }
}
