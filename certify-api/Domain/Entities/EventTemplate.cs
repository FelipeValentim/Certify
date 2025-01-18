using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class EventTemplate : AuditableEntity
    {
        public string Path { get; set; }

        public string PreviewPath { get; set; }
		
        public EventTemplate() : base()
        {
		}
    }
}
