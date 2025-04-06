using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class EventField : AuditableEntity
    {
        public Guid EventId { get; set; }
        public Event Event { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public bool IsRequired { get; set; }
        public int DisplayOrder { get; set; }

        //public string OptionsJson { get; set; }
    }
}
