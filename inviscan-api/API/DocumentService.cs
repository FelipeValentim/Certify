using Spire.Doc;

namespace InviScan
{
    public static class  DocumentService
    {
        public static void ConvertDocxToPdf(string docxFilePath, string pdfFilePath)
        {
            Document document = new Document();
            document.LoadFromFile(docxFilePath);

            //Convert Word to PDF
            document.SaveToFile(pdfFilePath, FileFormat.PDF);

            File.Delete(docxFilePath);
        }
    }
}
