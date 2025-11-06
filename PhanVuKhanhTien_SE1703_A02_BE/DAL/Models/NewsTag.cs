namespace DAL.Models;

public class NewsTag
{
    public int NewsArticleId { get; set; }
    public virtual NewsArticle NewsArticle { get; set; } = null!;
    public int TagId { get; set; }
    public virtual Tag Tag { get; set; } = null!;
}
