using System.Text.Json.Serialization;

namespace event_checkin_api.Models
{
    public class GuestModels
    {
        public class GuestItem
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("name")]
            public string Name { get; set; }

            [JsonPropertyName("photo")]
            public string Photo { get; set; }

            [JsonPropertyName("checkin")]
            public string Checkin { get; set; }
        }
    }
}
