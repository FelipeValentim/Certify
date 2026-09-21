namespace Domain.Constants
{
	public static class UrlManager
    {
        public static string Storage => Environment.GetEnvironmentVariable("STORAGE_URL") ?? "https://meucertificado.uk";

        public static string API => Environment.GetEnvironmentVariable("API_URL") ?? "https://certify-1wqq.onrender.com";
    }
}
