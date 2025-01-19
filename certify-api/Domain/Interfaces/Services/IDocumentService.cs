using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IDocumentService
    {
        Stream ConvertDocumentToPdf(Stream documentStream);
		bool PlaceholderExists(FileDTO file, params string[] placeholders);
		void GeneratePreview(FileDTO file, string previewPath);
        FileDTO ConvertDocumentToPdf(FileDTO file);

    }
}
