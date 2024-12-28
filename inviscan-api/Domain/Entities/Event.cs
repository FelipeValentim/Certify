using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Event : AuditableEntity
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public string Photo { get; set; }
		public int? Pax { get; set; }
		public DateTime Date { get; set; }
		public TimeSpan StartTime { get; set; }
		public TimeSpan EndTime { get; set; }

		public Guid UserId { get; set; }

        public UserProfile User { get; set; }

		public Guid EventTypeId { get; set; }

		public EventType EventType { get; set; }

		public ICollection<Guest> Guests { get; set; }

		public Event() : base()
        {
            Photo = "https://cdn.prod.website-files.com/648285b892d25284328a8a37/66e45432593b00dd787a616e_Calendar.jpg";

			CreatedDate = DateTime.Now;
		}
    }
}
