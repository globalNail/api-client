using DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace DAL;

public class NewsManagementDbContext : DbContext
{
    public NewsManagementDbContext(DbContextOptions options) : base(options)
    {
    }

    public NewsManagementDbContext()
    {
    }

    public virtual DbSet<SystemAccount> SystemAccounts { get; set; }
    public virtual DbSet<NewsArticle> NewsArticles { get; set; }
    public virtual DbSet<NewsTag> NewsTags { get; set; }
    public virtual DbSet<Tag> Tags { get; set; }
    public virtual DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SystemAccount>(entity =>
        {
            entity.HasKey(e => e.AccountId);
            entity.Property(e => e.Accountname).IsRequired().HasMaxLength(100);
            entity.Property(e => e.AccountPassword).IsRequired();
            entity.Property(e => e.AccountRole).IsRequired();
        });
        modelBuilder.Entity<NewsArticle>(entity =>
        {
            entity.HasKey(e => e.NewsArticleId);
            entity.Property(e => e.NewsTitle).IsRequired().HasMaxLength(200);
            entity.Property(e => e.NewsContent).IsRequired();
            entity.Property(e => e.NewsStatus).IsRequired();
            entity.HasOne(e => e.Category)
                  .WithMany(c => c.NewsArticles)
                  .HasForeignKey(e => e.CategoryId);
        });
        modelBuilder.Entity<Tag>(entity =>
        {
            entity.HasKey(e => e.TagId);
            entity.Property(e => e.TagName).IsRequired().HasMaxLength(50);
        });
        modelBuilder.Entity<NewsTag>(entity =>
        {
            entity.HasKey(e => new { e.NewsArticleId, e.TagId });
            entity.HasOne(nt => nt.NewsArticle)
                  .WithMany(na => na.NewsTags)
                  .HasForeignKey(nt => nt.NewsArticleId);
            entity.HasOne(nt => nt.Tag)
                  .WithMany(t => t.NewsTags)
                  .HasForeignKey(nt => nt.TagId);
        });
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId);
            entity.Property(e => e.CategoryName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.IsActive).IsRequired();
        });
    }
}
