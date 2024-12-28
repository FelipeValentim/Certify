using Domain.Entities;
using Domain.Interfaces.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{


	public class AuditableRepository<TContext, TEntity> : Repository<TContext, TEntity>, IAuditableRepository<TEntity> where TContext : DbContext where TEntity : AuditableEntity
	{
		public AuditableRepository(TContext context) : base(context)
		{
			
		}

		public virtual void Insert(TEntity entity)
		{
			dbSet.Add(entity);
			context.SaveChanges();
		}

		public virtual void Delete(object id)
		{
			TEntity entityToDelete = dbSet.Find(id);
			Delete(entityToDelete);
		}

		public virtual void Delete(Guid id)
		{
			var entity = GetByID(id);

			if (entity != null)
			{
				entity.DateDeleted = DateTime.Now;

				Update(entity);
			}
		}

		public virtual void Update(TEntity entity)
		{
			dbSet.Attach(entity);
			context.Entry(entity).State = EntityState.Modified;
			context.SaveChanges();
		}

		public void Delete(Guid[] ids)
		{
			var entities = GetAll(x => ids.Any(id => x.Id == id));

			foreach (var entity in entities)
			{
				entity.DateDeleted = DateTime.Now;

				Update(entity);
			}
		}
	}
}
