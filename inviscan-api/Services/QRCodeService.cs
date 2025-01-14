using Domain.Interfaces.Services;
using QRCoder;
using System.Drawing.Imaging;
using System.Drawing;
using Domain.Interfaces.Repositories;
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

        public byte[] GenerateQRCode(Guid id)
        {
            using (QRCodeGenerator qrGenerator = new QRCodeGenerator())
            {
                // Gerar os dados do QR Code
                QRCodeData qrCodeData = qrGenerator.CreateQrCode(id.ToString(), QRCodeGenerator.ECCLevel.Q);

                using (QRCode qrCode = new QRCode(qrCodeData))
                {
                    // Criar o QR Code como Bitmap
                    using (var qrCodeBitmap = qrCode.GetGraphic(20))
                    {
                        string logoPath = Path.Combine(_webHostEnvironment.WebRootPath, "default", "logo.png");

                        // Carregar a logo
                        using (var logo = Image.FromFile(logoPath))
                        {
                            // Calcular o tamanho da logo em relação ao QR Code
                            int logoSize = qrCodeBitmap.Width / 5; // A logo será 1/5 do tamanho do QR Code
                            var logoResized = new Bitmap(logo, new Size(logoSize, logoSize));

                            // Combinar a logo com o QR Code
                            using (var graphics = Graphics.FromImage(qrCodeBitmap))
                            {
                                // Definir a posição central para a logo
                                int x = (qrCodeBitmap.Width - logoSize) / 2;
                                int y = (qrCodeBitmap.Height - logoSize) / 2;

                                // Desenhar a logo no centro do QR Code
                                graphics.DrawImage(logoResized, x, y, logoSize, logoSize);
                            }

                            // Salvar o QR Code com a logo em um MemoryStream
                            using (var ms = new MemoryStream())
                            {
                                qrCodeBitmap.Save(ms, ImageFormat.Png);
                                return ms.ToArray(); // Retornar como array de bytes
                            }
                        }
                    }
                }
            }
        }
    }
}
