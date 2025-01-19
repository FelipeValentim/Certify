using Domain.DTO;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Hosting;
using Services.Helper;
using Spire.Doc;
using System.Collections;
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
		public Stream ConvertDocumentToPdf(Stream documentStream)
        {
			Document document = new Document();

			document.LoadFromStream(documentStream, FileFormat.Docx);

			foreach (Section section in document.Sections)
			{
				section.PageSetup.Margins.Bottom = 0;
			}

			// Cria o MemoryStream sem usar o bloco using
			MemoryStream stream = new MemoryStream();

			// Converte o documento para PDF e salva no MemoryStream
			document.SaveToStream(stream, FileFormat.PDF);

			// Reposiciona o ponteiro do stream para o início
			stream.Position = 0;

			return stream;
		}

        public FileDTO ConvertDocumentToPdf(FileDTO file)
        {
			var bytes = Convert.FromBase64String(file.Base64);

            Stream documentStream = new MemoryStream(bytes);

            Document document = new Document();

            document.LoadFromStream(documentStream, FileFormat.Docx);

            foreach (Section section in document.Sections)
            {
                section.PageSetup.Margins.Bottom = 0;
            }

            // Cria o MemoryStream sem usar o bloco using
            MemoryStream stream = new MemoryStream();

            // Converte o documento para PDF e salva no MemoryStream
            document.SaveToStream(stream, FileFormat.PDF);

            // Reposiciona o ponteiro do stream para o início
            stream.Position = 0;

			var dto = new FileDTO()
			{
				Name = "preview.pdf",
				Base64 = stream.ConvertToBase64(),
				MimeType = "application/pdf",
				Size = stream.Length
            };

            return dto;
        }

        public void GeneratePreview(FileDTO file, string previewPath)
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

     

        public bool PlaceholderExists(FileDTO file, params string[] placeholders)
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
