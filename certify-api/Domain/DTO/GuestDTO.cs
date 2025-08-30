
using System.Text.Json.Serialization;

namespace Domain.DTO
{
	public class GuestDTO : DTOBase
    {

		public GuestDTO()
		{
			FieldsValues = new List<EventFieldValueDTO>();
		}

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

        [JsonPropertyName("fieldsValues")]
        public IEnumerable<EventFieldValueDTO> FieldsValues { get; set; }
    }
}
