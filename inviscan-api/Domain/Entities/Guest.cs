using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Guest
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Photo { get; set; }

        public DateTime? DateCheckin { get; set; }

        public Guid EventId { get; set; }
        public Event Event { get; set; }

        public Guid? GuestId { get; set; }
        public ICollection<Guest> Guests { get; set; }
        public Guest GuestParent { get; set; }

        public Guest()
        {
            Id = Guid.NewGuid();

            Photo = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
        }

    }
}
