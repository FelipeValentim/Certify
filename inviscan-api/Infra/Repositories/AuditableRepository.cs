using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Infrastructure.Repositories
{

	public class AuditableRepository<TEntity> : AuditableRepository<InviScanDbContext, TEntity>, IAuditableRepository<TEntity> where TEntity : AuditableEntity
	{
		public AuditableRepository(InviScanDbContext context) : base(context)
		{
		}
	}

	public class AuditableRepository<TContext, TEntity> : Repository<TContext, TEntity>, IAuditableRepository<TEntity> where TContext : DbContext where TEntity : AuditableEntity
	{
		public AuditableRepository(TContext context) : base(context)
		{

		}

		public override IEnumerable<TEntity> GetAll(
			Expression<Func<TEntity, bool>> filter = null,
			Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
			string includeProperties = "")
		{
			IQueryable<TEntity> query = dbSet;

			query = query.Where(x => x.DeletedDate.HasValue == false);

			if (filter != null)
			{
				query = query.Where(filter);
			}

			foreach (var includeProperty in includeProperties.Split
				(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
			{
				query = query.Include(includeProperty);
			}

			if (orderBy != null)
			{
				return orderBy(query).ToList();
			}
			else
			{
				return query.ToList();
			}
		}

		public override TEntity Get(Expression<Func<TEntity, bool>> filter = null, string includeProperties = "")
		{
			IQueryable<TEntity> query = dbSet;

			query = query.Where(x => x.DeletedDate.HasValue == false);

			if (filter != null)
			{
				query = query.Where(filter);
			}

			foreach (var includeProperty in includeProperties.Split
				(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(p => p.Trim()))
			{
				query = query.Include(includeProperty);
			}

			return query.FirstOrDefault();
		}

		public override TEntity GetByID(Guid id)
		{
			IQueryable<TEntity> query = dbSet;

			query = query.Where(x => x.DeletedDate.HasValue == false);

			query.Where(x => x.Id == id);

			return query.FirstOrDefault();
		}

		public virtual void Insert(TEntity entity)
		{
			dbSet.Add(entity);
			context.SaveChanges();
		}

		public virtual void Delete(Guid id, bool physicalDeletion = false)
		{
			var entity = GetByID(id);

			if (entity != null)
			{
				if (physicalDeletion)
				{
					// Remover fisicamente do banco de dados
					dbSet.Remove(entity);
				}
				else
				{
					// Deleção lógica: apenas marca a data de exclusão
					entity.DeletedDate = DateTime.Now;
					Update(entity);  // Atualiza a entidade com a data de exclusão
				}

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
				entity.DeletedDate = DateTime.Now;

				Update(entity);
			}
		}

		public override int Count(Expression<Func<TEntity, bool>> filter = null)
		{
			IQueryable<TEntity> query = dbSet;

			query = query.Where(x => x.DeletedDate.HasValue == false);

			if (filter != null)
			{
				query = query.Where(filter);
			}

			return query.Count();
		}
	}
}
