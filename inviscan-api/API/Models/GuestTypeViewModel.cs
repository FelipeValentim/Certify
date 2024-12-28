using System.Text.Json.Serialization;

namespace API.Models
{

	public class GuestTypeViewModel : ViewModelBase
	{
		[JsonPropertyName("name")]
		public string Name { get; set; }
	}
}
