using Domain.Entities;
using Domain.Enum;
using iText.Kernel.Pdf.Canvas.Parser.ClipperLib;
using System.Text.Json.Serialization;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace API.Models
{

	public class GuestViewModel : ViewModelBase
	{

		[JsonPropertyName("name")]
		public string Name { get; set; }

		[JsonPropertyName("photo")]
		public string Photo { get; set; }

		[JsonPropertyName("checkinDate")]
		public DateTime? CheckinDate { get; set; }

		[JsonPropertyName("eventId")]
		public Guid EventId { get; set; }

		[JsonPropertyName("event")]
		public EventViewModel Event { get; set; }

		[JsonPropertyName("guestTypeId")]
		public Guid GuestTypeId { get; set; }

		[JsonPropertyName("guestType")]
		public GuestTypeViewModel GuestType { get; set; }

		[JsonPropertyName("guestStatus")]
		public GuestStatus GuestStatus
		{
			get
			{
				var status = GuestStatus.Created;

				if (CheckinDate.HasValue)
				{
					status = GuestStatus.Checkin;
				}
				else if (DateTime.Now >= Event.Date.Date.Add(Event.EndTime) && CheckinDate.HasValue == false)
				{
					status = GuestStatus.Absent;
				}

				return status;
			}
		}
	}
}
