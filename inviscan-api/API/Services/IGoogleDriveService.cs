using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Drive.v3.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;

namespace InviScan.Services
{

    public interface IGoogleDriveService
    {
        string UploadBase64Image(string base64);
    }
}
