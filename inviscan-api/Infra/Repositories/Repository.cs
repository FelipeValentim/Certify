using Domain.Entities;
using Domain.Interfaces.Repositories;
using Infrastructure.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
	public class Repository<TEntity> : Repository<InviScanDbContext, TEntity>, IRepository<TEntity> where TEntity : EntityBase
	{
		public Repository(InviScanDbContext context) : base(context)
		{
		}
	}

	public class Repository<TContext, TEntity> : IRepository<TEntity> where TContext : DbContext where TEntity : EntityBase
	{
		protected TContext context;
		protected DbSet<TEntity> dbSet;

		public Repository(TContext context)
		{
			this.context = context;
			dbSet = context.Set<TEntity>();
		}

		public virtual IEnumerable<TEntity> GetAll(
			Expression<Func<TEntity, bool>> filter = null,
			Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
			string includeProperties = "")
		{
			IQueryable<TEntity> query = dbSet;

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

		public virtual TEntity Get(Expression<Func<TEntity, bool>> filter = null, string includeProperties = "")
		{
			IQueryable<TEntity> query = dbSet;

			if (filter != null)
			{
				query = query.Where(filter);
			}

			foreach (var includeProperty in includeProperties.Split
				(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
			{
				query = query.Include(includeProperty);
			}

			return query.FirstOrDefault();
		}

		public virtual TEntity GetByID(object id)
		{
			return dbSet.Find(id);
		}
	}
}
