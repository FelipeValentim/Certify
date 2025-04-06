using Domain.Entities;
using System.Linq.Expressions;

namespace Domain.Interfaces.Repositories
{
    public interface IAuditableRepository<TEntity> : IRepository<TEntity> where TEntity : AuditableEntity
    {
		void Delete(Guid id, bool physicalDeletion = false);
		void Delete(Guid[] ids);

		void Update(TEntity entity);

        void UpdateRange(IEnumerable<TEntity> entities);
    }
}
