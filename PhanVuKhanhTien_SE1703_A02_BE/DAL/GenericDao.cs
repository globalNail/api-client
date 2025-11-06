using System.Net.Http.Headers;

namespace DAL;

public class GenericDao<T> where T : class
{
    private static GenericDao<T>? _instance;
    private static readonly object _lock = new object();
    private readonly NewsManagementDbContext _context;

    private GenericDao()
    {
        _context = new NewsManagementDbContext(); // Note: In production, inject via DI
    }

    public static GenericDao<T> Instance
    {
        get
        {
            if (_instance == null)
            {
                lock (_lock)
                {
                    if (_instance == null)
                    {
                        _instance = new GenericDao<T>();
                    }
                }
            }
            return _instance;
        }
    }

    public IQueryable<T> QueryAble()
    {
        return _context.Set<T>();
    }

    public List<T> GetAll()
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