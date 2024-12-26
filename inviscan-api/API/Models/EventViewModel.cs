using Domain.Enum;
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
		public DateTime Date { get; set; }

		[JsonPropertyName("startTime")]
		public TimeSpan StartTime { get; set; }

		[JsonPropertyName("endTime")]
		public TimeSpan EndTime { get; set; }

		[JsonPropertyName("pax")]
		public int? Pax { get; set; }



		[JsonPropertyName("eventTypeId")]
		public Guid EventTypeId { get; set; }

		[JsonPropertyName("eventType")]
		public EventTypeViewModel EventType { get; set; }

		[JsonPropertyName("guestsCount")]
		public int GuestsCount => Guests.Count;

		[JsonPropertyName("checkinCount")]
		public int CheckinCount => Guests.Where(x => !string.IsNullOrEmpty(x.Checkin)).Count();

		[JsonPropertyName("dropCount")]
		public int DropCount => GuestsCount - CheckinCount;


		[JsonPropertyName("eventStatus")]
		public EventStatus EventStatus
		{
			get
			{
				var status = EventStatus.Finished;

				if (DateTime.Now.Date <= Date.Date && DateTime.Now.TimeOfDay < StartTime)
				{
					status = EventStatus.Created;
				}
				else if (DateTime.Now.Date == Date.Date && DateTime.Now.TimeOfDay >= StartTime && DateTime.Now.TimeOfDay <= EndTime)
				{
					status = EventStatus.Helding;
				}

				return status;
			}
		}

		[JsonPropertyName("guests")]
		public ICollection<GuestViewModel> Guests { get; set; }

		[JsonPropertyName("user")]
		public UserViewModel User { get; set; }

		public EventViewModel()
		{
			Guests = new List<GuestViewModel>();

			Photo = "https://cdn.prod.website-files.com/648285b892d25284328a8a37/66e45432593b00dd787a616e_Calendar.jpg";
		}
	}
}
