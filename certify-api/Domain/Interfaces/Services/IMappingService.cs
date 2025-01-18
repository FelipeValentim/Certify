using Domain.DTO;

namespace Domain.Interfaces.Services
{
    public interface IMappingService
    {
        TDestination Map<TDestination>(object source);
        TDestination Map<TSource, TDestination>(TSource source);

    }
}
