using DAL;
using DAL.Models;

namespace BLL.Services
{
    public class AccountService
    {
        private readonly NewsManagementDbContext _context;

        public AccountService(NewsManagementDbContext context)
        {
            _context = context;
        }

        public SystemAccount? Authenticate(string email, string password)
        {
            return _context.SystemAccounts.FirstOrDefault(a => a.AccountEmail == email && a.AccountPassword == password);
        }

        public IEnumerable<SystemAccount> GetAll()
        {
            return _context.SystemAccounts.ToList();
        }

        public SystemAccount? GetById(int id)
        {
            return _context.SystemAccounts.Find(id);
        }

        public void Add(SystemAccount account)
        {
            _context.SystemAccounts.Add(account);
            _context.SaveChanges();
        }

        public void Update(SystemAccount account)
        {
            _context.SystemAccounts.Update(account);
            _context.SaveChanges();
        }

        public bool Delete(int id)
        {
            var account = GetById(id);
            if (account == null) return false;

            // Check if account has created any news articles
            if (_context.NewsArticles.Any(na => na.CreatedById == id))
            {
                return false; // Cannot delete
            }

            _context.SystemAccounts.Remove(account);
            _context.SaveChanges();
            return true;
        }

        public IEnumerable<SystemAccount> Search(string? name = null, string? email = null)
        {
            var query = _context.SystemAccounts.AsQueryable();
            if (!string.IsNullOrEmpty(name))
                query = query.Where(a => a.Accountname.Contains(name));
            if (!string.IsNullOrEmpty(email))
                query = query.Where(a => a.AccountEmail.Contains(email));
            return query.ToList();
        }
    }
}