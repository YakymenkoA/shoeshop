using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ShoesShop.Models;
using ShoesShop.Service.DTOs.Category;
using ShoesShop.Data;
using Microsoft.EntityFrameworkCore;


namespace ShoesShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController(ApplicationDbContext _context, IMapper _mapper) : ControllerBase
    {
        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryCreateDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid order item data.");
            }

            var existingCategory = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryName == dto.CategoryName);

            if (existingCategory != null)
            {
                return BadRequest("Category with this name already exists.");
            }

            var category = _mapper.Map<Category>(dto);
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();

            return Ok(category);
        }

        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<IEnumerable<CategoryGetDTO>>> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            var categoryDTOs = _mapper.Map<IEnumerable<CategoryGetDTO>>(categories);
            return Ok(categoryDTOs);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Category not found.");
            }

            var categoryDTO = _mapper.Map<CategoryGetDTO>(category);
            return Ok(categoryDTO);
        }

        [HttpPut]
        [Route("Update/{id:int}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryCreateDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid category data.");
            }

            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Category not found.");
            }

            category.CategoryName = dto.CategoryName!;
            _context.Categories.Update(category);
            await _context.SaveChangesAsync();

            return Ok("Category updated successfully.");
        }

        [HttpDelete]
        [Route("Delete/{id:int}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _context.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound("Category not found.");
            }

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return Ok("Category deleted successfully.");
        }

    }
}
