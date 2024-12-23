using System.Text.Json.Serialization;

namespace API.Models
{
	public class EventViewModel : ViewModelBase
	{
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
		public ICollection<GuestViewModel> Guests { get; set; }

		[JsonPropertyName("user")]
		public UserViewModel User { get; set; }

		public EventViewModel()
		{
			Guests = new List<GuestViewModel>();
		}
	}
}
