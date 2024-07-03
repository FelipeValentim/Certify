using System.Text.Json.Serialization;
using static API.Models.GuestModels;

namespace API.Models
{
    public class EventModels
    {
        public class EventItem
        {
            [JsonPropertyName("id")]
            public Guid Id { get; set; }

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

            public EventItem()
            {
                Guests = new List<GuestItem>();
            }
        }
    }
}
