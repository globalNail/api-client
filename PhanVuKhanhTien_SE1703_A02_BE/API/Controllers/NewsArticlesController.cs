using BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NewsArticlesController : ControllerBase
    {
        private readonly NewsArticleService _newsService;

        public NewsArticlesController(NewsArticleService newsService)
        {
            _newsService = newsService;
        }

        // Public: Get active news articles
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetActiveNews([FromQuery] string? search = null)
        {
            var news = _newsService.GetActiveNews(search);
            return Ok(news);
        }

        // Staff/Admin: Get all news articles
        [HttpGet("all")]
        [Authorize]
        public IActionResult GetAll([FromQuery] string? search = null)
        {
            var news = _newsService.GetAll(search);
            return Ok(news);
        }

        [HttpGet("{id}")]
        [Authorize]
        public IActionResult GetById(int id)
        {
            var news = _newsService.GetById(id);
            if (news == null) return NotFound();
            return Ok(news);
        }

        [HttpPost]
        [Authorize(Roles = "Staff,Admin")]
        public IActionResult Create([FromBody] NewsArticleCreateDto dto)
        {
            var accountId = int.Parse(User.FindFirst("AccountId")?.Value ?? "0");
            var news = _newsService.Create(dto, accountId);
            return CreatedAtAction(nameof(GetById), new { id = news.NewsArticleId }, news);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Staff,Admin")]
        public IActionResult Update(int id, [FromBody] NewsArticleUpdateDto dto)
        {
            var accountId = int.Parse(User.FindFirst("AccountId")?.Value ?? "0");
            var success = _newsService.Update(id, dto, accountId);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Staff,Admin")]
        public IActionResult Delete(int id)
        {
            var success = _newsService.Delete(id);
            if (!success) return NotFound();
            return NoContent();
        }

        // Staff: Get news created by self
        [HttpGet("my")]
        [Authorize(Roles = "Staff")]
        public IActionResult GetMyNews()
        {
            var accountId = int.Parse(User.FindFirst("AccountId")?.Value ?? "0");
            var news = _newsService.GetByCreator(accountId);
            return Ok(news);
        }
    }
}