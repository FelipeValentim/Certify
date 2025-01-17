using AutoMapper;
using Domain.DTO;
using Domain.Entities;

namespace Services.Mapping
{
    internal class GuestMappingProfile : Profile
    {
        public GuestMappingProfile()
        {
            CreateMap<GuestDTO, Guest>();
            CreateMap<Guest, GuestDTO>();

        }
    }
}
