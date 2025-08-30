using Domain.Enum;

namespace Domain.DTO
{
    public class EventFieldDTO : DTOBase
    {
        public Guid EventId { get; set; }
        public string Name { get; set; }
        public FieldType Type { get; set; }
        public bool IsRequired { get; set; }
        public int DisplayOrder { get; set; }
    }
}
