using DAL;
using Microsoft.EntityFrameworkCore;

namespace BLL
{
    public interface IRepository<T> where T : class
    {
        IEnumerable<T> GetAll();
        T? GetById(object id);
        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
        void DeleteById(object id);
    }

    public class Repository<T> : IRepository<T> where T : class
    {
        private static Repository<T> _instance;
        private static readonly object _lock = new object();
        private readonly NewsManagementDbContext _context;

        private Repository()
        {
            _context = new NewsManagementDbContext(); // Note: In production, inject via DI
        }

        public static Repository<T> Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_lock)
                    {
                        if (_instance == null)
                        {
                            _instance = new Repository<T>();
                        }
                    }
                }
                return _instance;
            }
        }

        public IEnumerable<T> GetAll()
        {
            return _context.Set<T>().ToList();
        }

        public T? GetById(object id)
        {
            return _context.Set<T>().Find(id);
        }

        public void Add(T entity)
        {
            _context.Set<T>().Add(entity);
            _context.SaveChanges();
        }

        public void Update(T entity)
        {
            _context.Set<T>().Update(entity);
            _context.SaveChanges();
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
            _context.SaveChanges();
        }

        public void DeleteById(object id)
        {
            var entity = GetById(id);
            if (entity != null)
            {
                Delete(entity);
            }
        }
    }
}