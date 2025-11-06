using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Models;

public class NewsArticle
{
    public int NewsArticleId { get; set; }
    public string NewsTitle { get; set; } = null!;
    public string Headline { get; set; } = null!;
    public string NewsContent { get; set; } = null!;
    public string NewsSource { get; set; } = null!;
    public int NewsStatus { get; set; }
    public int CategoryId { get; set; }
    public virtual Category Category { get; set; } = null!;
    public DateTime CreatedDate { get; set; }
    public int CreatedById { get; set; }
    [ForeignKey("CreatedById")]
    public virtual SystemAccount Creator { get; set; } = null!;
    public DateTime ModifiedDate { get; set; }
    public int UpdatedById { get; set; }
    [ForeignKey("UpdatedById")]
    public virtual SystemAccount? Modifier { get; set; }
    public virtual ICollection<NewsTag> NewsTags { get; set; } = new List<NewsTag>();
}
