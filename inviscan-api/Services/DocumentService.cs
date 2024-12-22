using Domain.Interfaces.Services;
using Spire.Doc;

namespace Services
{
    public class  DocumentService : IDocumentService
    {
        public void ConvertDocxToPdf(string docxFilePath, string pdfFilePath)
        {
            Document document = new Document();
            document.LoadFromFile(docxFilePath);

            //Convert Word to PDF
            document.SaveToFile(pdfFilePath, FileFormat.PDF);

            File.Delete(docxFilePath);
        }
    }
}
