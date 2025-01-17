using AutoMapper;
using Domain.DTO;
using Domain.Interfaces.Services;
using Microsoft.AspNetCore.Hosting;
using Spire.Doc;
using Xceed.Words.NET;

namespace Services
{
    public class MappingService : IMappingService
    {
		private readonly IMapper _mapper;

		public MappingService(IMapper mapper)
		{
            _mapper = mapper;
		}

        public TDestination Map<TDestination>(object source)
        {
            return _mapper.Map<TDestination>(source);
        }

        public TDestination Map<TSource, TDestination>(TSource source)
        {
            return _mapper.Map<TSource, TDestination>(source);
        }
    }
}
