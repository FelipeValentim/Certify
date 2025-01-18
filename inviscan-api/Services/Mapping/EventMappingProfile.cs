using AutoMapper;
using Domain.DTO;
using Domain.Entities;

namespace Services.Mapping
{
    internal class EventMappingProfile : Profile
    {
        public EventMappingProfile()
        {
            CreateMap<EventDTO, Event>();
            CreateMap<Event, EventDTO>();

        }
    }
}
