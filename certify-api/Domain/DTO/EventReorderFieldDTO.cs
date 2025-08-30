using Domain.Enum;

namespace Domain.DTO
{
    public class EventReorderFieldDTO : DTOBase
    {
        public Guid FieldId { get; set; }
        public int DisplayOrder { get; set; }
    }
}
