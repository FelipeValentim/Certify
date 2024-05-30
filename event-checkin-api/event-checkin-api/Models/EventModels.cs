using System.Text.Json.Serialization;
using static event_checkin_api.Models.GuestModels;

namespace event_checkin_api.Models
{
    public class EventModels
    {
        public class EventItem
        {
            [JsonPropertyName("id")]
            public string Id { get; set; }

            [JsonPropertyName("name")]
            public string Name { get; set; }

            [JsonPropertyName("photo")]
            public string Photo { get; set; }

            [JsonPropertyName("date")]
            public string Date { get; set; }

            [JsonPropertyName("guestsCount")]
            public int GuestsCount => Guests.Count;

            [JsonPropertyName("checkinCount")]
            public int CheckinCount => Guests.Where(x => !string.IsNullOrEmpty(x.Checkin)).Count();

            [JsonPropertyName("dropCount")]
            public int DropCount => GuestsCount - CheckinCount;

            [JsonPropertyName("guests")]
            public ICollection<GuestItem> Guests { get; set; }
        }
    }
}
