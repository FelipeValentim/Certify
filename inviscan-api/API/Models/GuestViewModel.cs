using System.Text.Json.Serialization;

namespace API.Models
{

	public class GuestViewModel : ViewModelBase
	{

		[JsonPropertyName("name")]
		public string Name { get; set; }

		[JsonPropertyName("photo")]
		public string Photo { get; set; }

		[JsonPropertyName("checkin")]
		public string Checkin { get; set; }

		[JsonPropertyName("event")]
		public Guid Event { get; set; }
	}
}
