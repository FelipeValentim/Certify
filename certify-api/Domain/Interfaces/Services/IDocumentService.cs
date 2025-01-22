using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IDocumentService
    {
        Stream ConvertDocumentToPdf(Stream documentStream);
		bool PlaceholderExists(FileDTO file, params string[] placeholders);
        FileDTO ConvertDocumentToPdf(FileDTO file);

    }
}
