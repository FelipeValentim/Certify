using System.Text.Json.Serialization;

namespace API.Models
{
	public class EventFieldViewModel : ViewModelBase
	{
		[JsonPropertyName("name")]
		public string Name { get; set; }

        [JsonPropertyName("displayOrder")]
        public int DisplayOrder { get; set; }

        [JsonPropertyName("type")]
        public string Type { get; set; }


        [JsonPropertyName("isRequired")]
        public bool IsRequired { get; set; }
    }
}
