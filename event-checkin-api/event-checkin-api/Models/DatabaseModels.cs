using System.Text.Json.Serialization;

namespace event_checkin_api.Models
{
    public class DatabaseModels
    {
        public class User
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public string PasswordHash { get; set; }

            public User()
            {
                Id = Guid.NewGuid().ToString();
            }
        }

        public class Event
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("name")]
            public string Name { get; set; }

            [JsonPropertyName("date")]
            public DateTime Date { get; set; }

            [JsonPropertyName("dateEvent")]
            public string DateEvent => Date.ToString("dd/MM/yyyy");

            [JsonPropertyName("photo")]

            public string Photo { get; set; }

            [JsonPropertyName("user")]
            public User User { get; set; }

            public Event()
            {
                Id = Guid.NewGuid().ToString();
            }
        }

        public class Guest
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("name")]
            public string Name { get; set; }

            [JsonPropertyName("photo")]
            public string Photo { get; set; }

            [JsonPropertyName("dateCheckin")]
            public DateTime? DateCheckin { get; set; }

            [JsonPropertyName("eventId")]
            public string EventId { get; set; }

            public Guest()
            {
                Id = Guid.NewGuid().ToString();
            }
        }
    }
}
