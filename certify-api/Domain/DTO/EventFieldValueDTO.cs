using Domain.Entities;
using Domain.Enum;

namespace Domain.DTO
{
    public class EventFieldValueDTO : DTOBase
    {
        public Guid EventFieldId { get; set; }
        public EventFieldDTO EventField { get; set; }
        public Guid GuestId { get; set; }
        public string Value { get; set; }
    }
}
