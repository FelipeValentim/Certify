using System.Text.Json.Serialization;

namespace API.Models
{
	public class UserViewModel
	{
		[JsonPropertyName("id")]
		public Guid Id { get; set; }

		[JsonPropertyName("name")]
		public string Name { get; set; }

	}
}
