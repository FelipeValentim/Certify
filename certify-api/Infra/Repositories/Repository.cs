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
	public class Repository<TEntity> : Repository<CertifyDbContext, TEntity>, IRepository<TEntity> where TEntity : EntityBase
	{
		public Repository(CertifyDbContext context) : base(context)
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

        public virtual void Insert(TEntity entity)
        {
            dbSet.Add(entity);
            context.SaveChanges();
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

		public virtual TEntity GetByID(Guid id)
		{
			return dbSet.Find(id);
		}

		public virtual int Count(Expression<Func<TEntity, bool>> filter = null)
		{
			IQueryable<TEntity> query = dbSet;

			if (filter != null)
			{
				query = query.Where(filter);
			}

			return query.Count();
		}

        public int GetMax(
		Expression<Func<TEntity, int>> selector,
		Expression<Func<TEntity, bool>> filter = null)
        {
            IQueryable<TEntity> query = dbSet;

            if (filter != null)
                query = query.Where(filter);

            var max = query.Select(selector).DefaultIfEmpty(0).Max();

            return max;
        }
    }
}
