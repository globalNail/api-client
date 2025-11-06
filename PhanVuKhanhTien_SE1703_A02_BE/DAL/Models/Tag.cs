namespace DAL.Models;

public class Tag
{
    public int TagId { get; set; }
    public string TagName { get; set; } = null!;
    public string? Note { get; set; }
    public virtual ICollection<NewsTag> NewsTags { get; set; } = new List<NewsTag>();
}
