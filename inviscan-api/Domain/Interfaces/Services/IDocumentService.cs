using Domain.Dto;

namespace Domain.Interfaces.Services
{
    public interface IDocumentService
    {
        void ConvertDocxToPdf(string docxFilePath, string pdfFilePath);
		bool PlaceholderExists(FileDto file, params string[] placeholders);
		void GeneratePreview(FileDto file, string previewPath);
	}
}
