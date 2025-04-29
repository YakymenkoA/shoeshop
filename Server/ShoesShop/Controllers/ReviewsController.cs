using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using ShoesShop.Data;
using ShoesShop.Models;
using ShoesShop.Service;
using ShoesShop.Service.DTOs.Review;

namespace ShoesShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController(ApplicationDbContext _context, IMapper _mapper) : ControllerBase
    {
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDTO dto)
        {
            var userId = HttpContext.User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var productExists = await _context.Products.AnyAsync(p => p.Id == dto.ProductId);
            if (!productExists)
                return NotFound($"Product with ID {dto.ProductId} not found.");

            var review = _mapper.Map<Review>(dto);
            review.UserId = userId;

            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();

            review = await _context.Reviews.Where(r => r.Id == review.Id).Include(u =>u.User).FirstAsync();
            var reviewDto = _mapper.Map<ReviewGetDTO>(review);

            return Ok(new { Message = "Review Created Successfully", Review = reviewDto });
        }

        [HttpGet]
        public async Task<ActionResult<PaginatedList<ReviewGetDTO>>> GetAllReviews(int page = 1, int pageSize = 10)
        {
            var totalCount = await _context.Reviews.CountAsync();

            var reviews = await _context.Reviews
                .Include(r => r.Product)
                .Include(r => r.User)
                .OrderByDescending(r => r.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var reviewDTOs = _mapper.Map<IEnumerable<ReviewGetDTO>>(reviews).ToList();

            return Ok(new PaginatedList<ReviewGetDTO>
            {
                Items = reviewDTOs,
                TotalCount = totalCount
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewGetDTO>> GetReviewById(int id)
        {
            var review = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Product)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (review == null)
            {
                return NotFound($"Review with ID {id} not found.");
            }

            var reviewDto = _mapper.Map<ReviewGetDTO>(review);
            return Ok(reviewDto);
        }

        [HttpGet("byProduct/{productId}")]
        public async Task<ActionResult<IEnumerable<ReviewGetDTO>>> GetReviewsByProductId(int productId)
        {
            
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Product)
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.CreateDate)
                .ToListAsync();

            
            if (reviews.Count == 0)
            {
                return Ok(new List<ReviewGetDTO>());
            }

            var reviewDtos = _mapper.Map<IEnumerable<ReviewGetDTO>>(reviews);
            return Ok(reviewDtos);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateReview(int id, [FromBody] ReviewUpdateDTO request)
        {
            var userId = HttpContext.User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                return NotFound($"Review with ID {id} not found.");

            
            if (review.UserId != userId)
                return Forbid(); 

            review.Rating = request.Rating;
            review.Comment = request.Comment;

            _context.Reviews.Update(review);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Review Updated Successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var userId = HttpContext.User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var review = await _context.Reviews.FindAsync(id);
            if (review == null)
                return NotFound($"Review with ID {id} not found.");

            if (review.UserId != userId)
                return Forbid();

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Review deleted successfully" });
        }
    }
}
