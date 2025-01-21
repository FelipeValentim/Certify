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

		public Guid? EventTemplateId { get; set; }
		public EventTemplate EventTemplate { get; set; }

		public virtual IEnumerable<Guest> Guests { get; set; }

		public Event() : base()
        {
            Photo = "/default/lecture.png";

			CreatedDate = DateTime.UtcNow;
		}
    }
}
