using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Event
    {
        public Guid Id { get; set; }
        
        public string Name { get; set; }

        public string Description { get; set; }

        public string Photo { get; set; }

        public Guid UserId { get; set; }

        public User User { get; set; }

        public DateTime Date { get; set; }

        public ICollection<Guest> Guests { get; set; }

        public Event()
        {
            Id = Guid.NewGuid();
        }
    }
}
