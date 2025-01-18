using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;

namespace Repository
{
    public class GuestTypeRepository :  Repository<GuestType>, IGuestTypeRepository
    {
        public GuestTypeRepository(CertifyDbContext context) : base(context)
        {
        }
    }
}