namespace DAL.Models;

public class Category
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
    public string CategoryDescription { get; set; } = null!;
    public int ParentCategoryId { get; set; }
    public int IsActive { get; set; }
    public virtual ICollection<NewsArticle> NewsArticles { get; set; } = new List<NewsArticle>();
}
