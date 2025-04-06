
using System.Text.Json.Serialization;

namespace Domain.DTO
{
	public class GuestDTO : DTOBase
    {

		[JsonPropertyName("name")]
		public string Name { get; set; }

		[JsonPropertyName("email")]
		public string Email { get; set; }

		[JsonPropertyName("photo")]
		public string Photo { get; set; }

        [JsonPropertyName("photoFile")]
        public FileDTO PhotoFile { get; set; }

        [JsonPropertyName("guestTypeId")]
		public Guid GuestTypeId { get; set; }

		[JsonPropertyName("eventId")]
		public Guid EventId { get; set; }

	}
}
