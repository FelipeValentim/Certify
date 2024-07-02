using System.Text.Json.Serialization;

namespace API.Models
{
    public class GuestModels
    {
        public class GuestItem
        {
            [JsonPropertyName("id")]
            public int Id { get; set; }

            [JsonPropertyName("name")]
            public string Name { get; set; }

            [JsonPropertyName("photo")]
            public string Photo { get; set; }

            [JsonPropertyName("checkin")]
            public string Checkin { get; set; }

            [JsonPropertyName("event")]
            public int Event { get; set; }
        }
    }
}
