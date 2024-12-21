using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;
using Google.Apis.Services;
using Google.Apis.Upload;
using Google.Apis.Util.Store;

namespace InviScan.Services
{

    public class GoogleDriveService : IGoogleDriveService
    {
        private string[] Scopes = { DriveService.Scope.Drive };

        public string UploadBase64Image(string base64)
        {
            // Convert base64 string to byte array
            byte[] byteArray = Convert.FromBase64String(base64);

            // Load the service account key JSON file
            GoogleCredential credential;
            using (var stream = new FileStream("inviscan.json", FileMode.Open, FileAccess.Read))
            {
                credential = GoogleCredential.FromStream(stream)
                    .CreateScoped(Scopes);
            }
            // Create the Drive service
            var service = new DriveService(new BaseClientService.Initializer()
            {
                HttpClientInitializer = credential,
                ApplicationName = "InviScan",
            });

            var fileName = Guid.NewGuid().ToString();

            // File metadata
            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = fileName,
                MimeType = "image/jpeg"
            };

            // File content
            using (var streamContent = new MemoryStream(byteArray))
            {
                // Upload file
                var request = service.Files.Create(fileMetadata, streamContent, "image/jpeg");
                request.ChunkSize = ResumableUpload.MinimumChunkSize * 4;

                var result = request.Upload();

                var permission = new Permission
                {
                    Type = "anyone",
                    Role = "reader"
                };
                // Construct and return the file URL
                var file = request.ResponseBody;

                service.Permissions.Create(permission, file.Id).ExecuteAsync();

                string fileUrl = $"https://drive.google.com/uc?export=view&id={file.Id}";

                return fileUrl;

            }
        }
    }
}
