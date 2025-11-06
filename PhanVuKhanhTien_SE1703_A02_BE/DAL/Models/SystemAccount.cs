namespace DAL.Models;

public class SystemAccount
{
    public int AccountId { get; set; }
    public string Accountname { get; set; } = null!;
    public string AccountEmail { get; set; } = null!;
    public int AccountRole { get; set; }
    public string AccountPassword { get; set; } = null!;
    public virtual ICollection<NewsArticle> NewsArticles { get; set; } = new List<NewsArticle>();
}
