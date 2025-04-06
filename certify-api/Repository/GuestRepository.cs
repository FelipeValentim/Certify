using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Repository
{
	public class GuestRepository : AuditableRepository<Guest>, IGuestRepository
	{
		public GuestRepository(CertifyDbContext context) : base(context)
		{
		}

		public IEnumerable<Guest> GetGuests(Guid eventId)
		{
			return GetAll(x => x.EventId == eventId, includeProperties: "GuestType");
		}

		public bool Exists(Guid eventId, string email)
		{
			return Count(x => x.Email.ToLower() == email.ToLower() && x.EventId == eventId) > 0;
		}

        public IEnumerable<Guest> GetAllRelated(Expression<Func<Guest, bool>> filter = null)
        {
            return dbSet.Where(filter)
                        .Include(x => x.GuestType)
                        .Include(x => x.FieldsValues)
                        .ThenInclude(fv => fv.EventField)
                        .ToList();
        }
    }
}