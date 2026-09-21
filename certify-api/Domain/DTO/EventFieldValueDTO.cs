using Domain.Entities;
using Domain.Enum;
using System.Text.Json.Serialization;

namespace Domain.DTO
{
    public class EventFieldValueDTO : DTOBase
    {
        [JsonPropertyName("eventFieldId")]
        public Guid EventFieldId { get; set; }
        public EventFieldDTO EventField { get; set; }
        public Guid GuestId { get; set; }
        [JsonPropertyName("value")]
        public string Value { get; set; }
    }
}
