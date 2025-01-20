using Domain.Interfaces.Services;
using QRCoder;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Drawing.Processing;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Processing;
using Domain.DTO;
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
            using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
            {
                // Gerar os dados do QR Code
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(value, QRCodeGenerator.ECCLevel.Q);

                using (QRCode qrCode = new QRCode(qrCodeData))
                {
                    // Criar o QR Code como matriz de pixels
                    BitmapByteQRCode qrCodeImage = new BitmapByteQRCode(qrCodeData);
                    byte[] qrCodeBytes = qrCodeImage.GetGraphic(20);

                    // Carregar o QR Code no ImageSharp
                    using (var qrCodeImageSharp = Image.Load<Rgba32>(qrCodeBytes))
                    {
                        // Caminho para o logo
                        string logoPath = Path.Combine(_webHostEnvironment.WebRootPath, "default", "logo.png");

                        // Carregar o logo com ImageSharp
                        using (var logoImage = Image.Load<Rgba32>(logoPath))
                        {
                            // Redimensionar a logo
                            int logoSize = qrCodeImageSharp.Width / 5;
                            logoImage.Mutate(x => x.Resize(logoSize, logoSize));

                            // Centralizar a logo no QR Code
                            int x = (qrCodeImageSharp.Width - logoSize) / 2;
                            int y = (qrCodeImageSharp.Height - logoSize) / 2;

                            // Combinar a logo com o QR Code
                            qrCodeImageSharp.Mutate(m => m.DrawImage(logoImage, new Point(x, y), 1f));
                        }

                        // Salvar o QR Code final como array de bytes
                        using (var ms = new MemoryStream())
                        {
                            qrCodeImageSharp.Save(ms, new PngEncoder());
                            var name = Guid.NewGuid();

                            return new FileDTO
                            {
                                MimeType = "image/png",
                                Name = $"{name:N}.png",
                                Data = ms.ToArray()
                            };
                        }
                    }
                }
            }
        }
    }
}
