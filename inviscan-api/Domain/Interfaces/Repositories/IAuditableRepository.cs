using Domain.Entities;
using System.Linq.Expressions;

namespace Domain.Interfaces.Repositories
{
    public interface IAuditableRepository<TEntity> : IRepository<TEntity> where TEntity : AuditableEntity
    {
		IEnumerable<TEntity> GetAll(
			Expression<Func<TEntity, bool>> filter = null,
			Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
			string includeProperties = "", bool deleted = false);

		void Insert(TEntity entity);

		void Delete(Guid id);
		void Delete(Guid[] ids);

		void Update(TEntity entity);

	}
}
