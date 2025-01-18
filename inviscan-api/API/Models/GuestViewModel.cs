using Domain.Constants;
using Domain.Entities;
using Domain.Enum;
using Services.Helper;
using System.Text.Json.Serialization;

namespace API.Models
{

	public class GuestViewModel : ViewModelBase
	{
		[JsonPropertyName("accessCode")]
		public string AccessCode => HasherId.Encode(Id, Salt.GuestGUID);

        [JsonPropertyName("name")]
		public string Name { get; set; }

		[JsonPropertyName("email")]
		public string Email { get; set; }

		[JsonPropertyName("photo")]
		public string Photo { get; set; }

		[JsonPropertyName("photoFullUrl")]
		public string PhotoFullUrl => $"{Default.URL}{Photo}"; // Opcional: imagem padrão

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
				var status = GuestStatus.Pending;

				if (CheckinDate.HasValue)
				{
					status = GuestStatus.Checkin;
				}

				return status;
			}
		}
	}
}
