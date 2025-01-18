using AutoMapper;
using Domain.DTO;
using Domain.Entities;

namespace Services.Mapping
{
    internal class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<UserDTO, UserProfile>();
            CreateMap<UserProfile, UserDTO>();
        }
    }
}
