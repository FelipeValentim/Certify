using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Guest
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Photo { get; set; }

        public DateTime? DateCheckin { get; set; }

        public int EventId { get; set; }
        public Event Event { get; set; }

        public int GuestId { get; set; }
        public ICollection<Guest> Guests { get; set; }
        public Guest GuestParent { get; set; }

    }
}
