using System.Text.Json.Serialization;

namespace API.Models
{
    public class GuestModels
    {
        public class GuestItem
        {
            [JsonPropertyName("id")]
            public Guid Id { get; set; }

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
}
