using System.Text.Json.Serialization;

namespace Domain.DTO
{
	public class EventDTO : DTOBase
	{
		public string Name { get; set; }

        public string Photo { get; set; }

        public FileDTO PhotoFile { get; set; }

        public bool? CheckinEnabled { get; set; }

        public DateTime Date { get; set; }

		public TimeSpan StartTime { get; set; }

		public TimeSpan EndTime { get; set; }

		public int? Pax { get; set; }

        public Guid EventTypeId { get; set; }

        public UserDTO User { get; set; }

	}
}
