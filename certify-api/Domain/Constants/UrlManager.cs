namespace Domain.Constants
{
	public static class UrlManager
    {
        public static string Storage => Environment.GetEnvironmentVariable("STORAGE_URL");

        public static string API => Environment.GetEnvironmentVariable("API_URL");
    }
}
