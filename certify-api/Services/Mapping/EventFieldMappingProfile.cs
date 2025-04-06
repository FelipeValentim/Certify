using AutoMapper;
using Domain.DTO;
using Domain.Entities;

namespace Services.Mapping
{
    internal class EventFieldMappingProfile : Profile
    {
        public EventFieldMappingProfile()
        {
            CreateMap<EventFieldDTO, EventField>();
            CreateMap<EventField, EventFieldDTO>();

        }
    }
}
