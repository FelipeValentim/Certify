using Domain.Constants;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Guest : AuditableEntity
    {
        public string Name { get; set; }
		public string Email { get; set; }

		public string Photo { get; set; }

        public DateTime? CheckinDate { get; set; }

        public Guid EventId { get; set; }
        public Event Event { get; set; }
		public Guid GuestTypeId { get; set; }
		public GuestType GuestType { get; set; }

		public Guest() : base()
        {
            Photo = $"/default/avatar.png";
        }

    }
}
