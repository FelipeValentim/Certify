using Domain.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Services
{
    public interface IEventFieldService
    {
        public Guid Add(EventFieldDTO eventField);
        public IEnumerable<EventFieldDTO> GetAll(Guid eventId);
        public EventFieldDTO Get(Guid eventField);
        public void ReorderFields(EventReorderFieldDTO eventReorderFieldDTO);
        void ReorderFields(IEnumerable<Guid> reorderFields, Guid eventId);
    }
}
