using Domain.Entities;

namespace Domain.Interfaces.Repositories
{
    public interface IAuditableRepository<TEntity> : IRepository<TEntity> where TEntity : AuditableEntity
    {
		void Insert(TEntity entity);

		void Delete(Guid id);
		void Delete(Guid[] ids);

		void Update(TEntity entity);

	}
}
