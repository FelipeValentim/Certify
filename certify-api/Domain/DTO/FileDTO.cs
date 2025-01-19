using System.Text.Json.Serialization;

namespace Domain.DTO
{
	public class FileDTO
	{
		[JsonPropertyName("name")]
		public string Name { get; set; }

		[JsonPropertyName("base64")]
		public string Base64 { get; set; }

        [JsonPropertyName("data")]
        public byte[] Data { get; set; }

        [JsonPropertyName("mimeType")]
		public string MimeType { get; set; }

		[JsonPropertyName("size")]
		public long Size { get; set; }

        [JsonPropertyName("path")]
        public string Path { get; set; }
    }
}
