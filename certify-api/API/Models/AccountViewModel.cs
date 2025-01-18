using System.Text.Json.Serialization;

namespace API.Models
{
	public class AccountViewModel : ViewModelBase
	{
		[JsonPropertyName("email")]
		public string Email { get; set; }

		[JsonPropertyName("password")]
		public string Password { get; set; }
	}
}
