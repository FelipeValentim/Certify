using Domain.Dto;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Hosting;
using Spire.Doc;
using System.Linq;
using Xceed.Words.NET;

namespace Services
{
    public class  DocumentService : IDocumentService
    {

		private readonly IWebHostEnvironment _webHostEnvironment;

		public DocumentService(IWebHostEnvironment webHostEnvironment)
		{
			_webHostEnvironment = webHostEnvironment;
		}
		public void ConvertDocxToPdf(string docxFilePath, string pdfFilePath)
        {
			Document document = new Document();
            document.LoadFromFile(docxFilePath);

            //Convert Word to PDF
            document.SaveToFile(pdfFilePath, FileFormat.PDF);

            File.Delete(docxFilePath);
        }

		public void GeneratePreview(FileDto file, string previewPath)
		{
			string fullPreviewPath = Path.Combine(_webHostEnvironment.WebRootPath, previewPath.TrimStart('/'));

			Document document = new Document();

			byte[] fileBytes = Convert.FromBase64String(file.Base64);
			using (MemoryStream memoryStream = new MemoryStream(fileBytes))
			{
				document.LoadFromStream(memoryStream, FileFormat.Docx);

				// Configurar margens e layout
				foreach (Section section in document.Sections)
				{
					section.PageSetup.Margins.Bottom = 0;
				}

				// Salvar como PDF
				document.SaveToFile(fullPreviewPath, FileFormat.PDF);
			}
		}

		public bool PlaceholderExists(FileDto file, params string[] placeholders)
		{
			byte[] fileBytes = Convert.FromBase64String(file.Base64);

			MemoryStream memoryStream = new MemoryStream(fileBytes);

			using (DocX document = DocX.Load(memoryStream))
            {
				return placeholders.All(placeholder => document.Paragraphs.Any(paragraph => paragraph.Text.Contains(placeholder)));
			}
		}
	}
}
