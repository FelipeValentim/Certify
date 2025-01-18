using System.Text.Json.Serialization;

namespace API.Models
{

	public class EventTypeViewModel : ViewModelBase
	{
		[JsonPropertyName("name")]
		public string Name { get; set; }
	}
}
