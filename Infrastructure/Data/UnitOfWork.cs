using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;

namespace Infrastructure.Data
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ShopContext _context;
        private Dictionary<string, object> _repositories;

        public UnitOfWork(ShopContext context)
        {
            _context = context;
        }
        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            _repositories ??= new Dictionary<string, object>();

            var type = typeof(TEntity).Name;
            
            if (_repositories.ContainsKey(type))
            {
                return (IGenericRepository<TEntity>) _repositories[type];
            }

            var repositoryType = typeof(GenericRepository<>);
            var repositoryInstance = Activator.CreateInstance(
                repositoryType.MakeGenericType(typeof(TEntity)),
                _context);
            
            _repositories.Add(type, repositoryInstance);

            return (IGenericRepository<TEntity>)_repositories[type];
        }
    }
}