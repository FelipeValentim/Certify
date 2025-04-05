using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class EventFieldValue : AuditableEntity
    {
        public Guid EventFieldId { get; set; }
        public EventField EventField { get; set; }

        public Guid GuestId { get; set; }
        public Guest Guest { get; set; }

        public string Value { get; set; }
    }

}
