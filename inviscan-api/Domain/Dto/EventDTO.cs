using System.Text.Json.Serialization;

namespace Domain.DTO
{
	public class EventDTO
	{
		public Guid Id { get; set; }

		public string Name { get; set; }

		public string Photo { get; set; }

		public DateTime Date { get; set; }

		public TimeSpan StartTime { get; set; }

		public TimeSpan EndTime { get; set; }

		public int? Pax { get; set; }

		public UserDTO User { get; set; }

	}
}
