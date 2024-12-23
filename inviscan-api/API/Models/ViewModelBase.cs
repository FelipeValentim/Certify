using System.Text.Json.Serialization;

namespace API.Models
{

	public class ViewModelBase
	{
		[JsonPropertyName("id")]
		public Guid Id { get; set; }
	}
}
