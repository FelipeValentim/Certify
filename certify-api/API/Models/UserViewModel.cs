using System.Text.Json.Serialization;

namespace API.Models
{
	public class UserViewModel : ViewModelBase
	{
		[JsonPropertyName("name")]
		public string Name { get; set; }

	}
}
