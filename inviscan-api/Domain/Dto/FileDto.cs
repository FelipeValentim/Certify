using System.Text.Json.Serialization;

namespace Domain.Dto
{
	public class FileDto
	{
		[JsonPropertyName("name")]
		public string Name { get; set; }

		[JsonPropertyName("base64")]
		public string Base64 { get; set; }

		[JsonPropertyName("mimeType")]
		public string MimeType { get; set; }

		[JsonPropertyName("size")]
		public int Size { get; set; }
	}
}
