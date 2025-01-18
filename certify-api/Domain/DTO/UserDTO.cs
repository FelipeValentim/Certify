using System.Text.Json.Serialization;

namespace Domain.DTO
{
	public class UserDTO
	{
		public Guid Id { get; set; }

		public string Name { get; set; }
	}
}
