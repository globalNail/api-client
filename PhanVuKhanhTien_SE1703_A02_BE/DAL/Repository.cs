using DAL.Models;

namespace DAL;

public class Repository : IRepository
{
    public List<Category> GetAllCategories() => GenericDao<Category>.Instance.GetAll();
    public SystemAccount Login(string email, string password)
    {
        var dao = GenericDao<SystemAccount>.Instance.GetAll()
            .Where(acc => acc.AccountEmail == email && acc.AccountPassword == password)
            .FirstOrDefault();
        return dao;
    }
}
