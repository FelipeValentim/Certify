using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces.Repositories
{
    public interface IRepository<TEntity> where TEntity : EntityBase
    {
        IEnumerable<TEntity> GetAll(
            Expression<Func<TEntity, bool>> filter = null,
            Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
            string includeProperties = "");
        TEntity Get(
    Expression<Func<TEntity, bool>> filter = null,
    string includeProperties = "");


        TEntity GetByID(Guid id);

        int Count(Expression<Func<TEntity, bool>> filter = null);


	}
}
