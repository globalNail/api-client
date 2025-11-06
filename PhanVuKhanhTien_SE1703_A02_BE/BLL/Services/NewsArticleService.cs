using DAL;
using DAL.Models;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace BLL.Services
{
    public class NewsArticleService
    {
        private readonly NewsManagementDbContext _context;

        public NewsArticleService(NewsManagementDbContext context)
        {
            _context = context;
        }

        public IEnumerable<NewsArticle> GetActiveNews(string? search = null)
        {
            var query = _context.NewsArticles
                .Where(na => na.NewsStatus == 1)
                .Include(na => na.Category)
                .Include(na => na.NewsTags).ThenInclude(nt => nt.Tag)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(na => na.NewsTitle.Contains(search) || na.NewsContent.Contains(search));
            }

            return query.OrderByDescending(na => na.CreatedDate).ToList();
        }

        public IEnumerable<NewsArticle> GetAll(string? search = null)
        {
            var query = _context.NewsArticles
                .Include(na => na.Category)
                .Include(na => na.NewsTags).ThenInclude(nt => nt.Tag)
                .AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(na => na.NewsTitle.Contains(search) || na.NewsContent.Contains(search));
            }

            return query.OrderByDescending(na => na.CreatedDate).ToList();
        }

        public NewsArticle? GetById(int id)
        {
            return _context.NewsArticles
                .Include(na => na.Category)
                .Include(na => na.NewsTags).ThenInclude(nt => nt.Tag)
                .FirstOrDefault(na => na.NewsArticleId == id);
        }

        public NewsArticle Create(NewsArticleCreateDto dto, int createdById)
        {
            var news = new NewsArticle
            {
                NewsTitle = dto.NewsTitle,
                Headline = dto.Headline,
                NewsContent = dto.NewsContent,
                NewsSource = dto.NewsSource,
                NewsStatus = 1, // Active
                CategoryId = dto.CategoryId,
                CreatedDate = DateTime.Now,
                CreatedById = createdById,
                ModifiedDate = DateTime.Now,
                UpdatedById = createdById
            };

            _context.NewsArticles.Add(news);
            _context.SaveChanges();

            // Add tags
            foreach (var tagId in dto.TagIds)
            {
                _context.NewsTags.Add(new NewsTag { NewsArticleId = news.NewsArticleId, TagId = tagId });
            }
            _context.SaveChanges();

            return news;
        }

        public bool Update(int id, NewsArticleUpdateDto dto, int updatedById)
        {
            var news = _context.NewsArticles.Find(id);
            if (news == null) return false;

            news.NewsTitle = dto.NewsTitle;
            news.Headline = dto.Headline;
            news.NewsContent = dto.NewsContent;
            news.NewsSource = dto.NewsSource;
            news.CategoryId = dto.CategoryId;
            news.ModifiedDate = DateTime.Now;
            news.UpdatedById = updatedById;

            // Update tags
            var existingTags = _context.NewsTags.Where(nt => nt.NewsArticleId == id).ToList();
            _context.NewsTags.RemoveRange(existingTags);

            foreach (var tagId in dto.TagIds)
            {
                _context.NewsTags.Add(new NewsTag { NewsArticleId = id, TagId = tagId });
            }

            _context.SaveChanges();
            return true;
        }

        public bool Delete(int id)
        {
            var news = _context.NewsArticles.Find(id);
            if (news == null) return false;

            // Remove tags
            var tags = _context.NewsTags.Where(nt => nt.NewsArticleId == id);
            _context.NewsTags.RemoveRange(tags);

            _context.NewsArticles.Remove(news);
            _context.SaveChanges();
            return true;
        }

        public IEnumerable<NewsArticle> GetByCreator(int creatorId)
        {
            return _context.NewsArticles
                .Where(na => na.CreatedById == creatorId)
                .Include(na => na.Category)
                .Include(na => na.NewsTags).ThenInclude(nt => nt.Tag)
                .OrderByDescending(na => na.CreatedDate)
                .ToList();
        }
    }

    public class NewsArticleCreateDto
    {
        [Required]
        [StringLength(200)]
        public string NewsTitle { get; set; } = string.Empty;

        [Required]
        public string Headline { get; set; } = string.Empty;

        [Required]
        public string NewsContent { get; set; } = string.Empty;

        [Required]
        public string NewsSource { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }

        public List<int> TagIds { get; set; } = new();
    }

    public class NewsArticleUpdateDto
    {
        [Required]
        [StringLength(200)]
        public string NewsTitle { get; set; } = string.Empty;

        [Required]
        public string Headline { get; set; } = string.Empty;

        [Required]
        public string NewsContent { get; set; } = string.Empty;

        [Required]
        public string NewsSource { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }

        public List<int> TagIds { get; set; } = new();
    }
}