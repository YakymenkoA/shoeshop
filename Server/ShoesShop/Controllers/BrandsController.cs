using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoesShop.Data;
using ShoesShop.Models;
using ShoesShop.Service.DTOs.Brand;

namespace ShoesShop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrandsController(ApplicationDbContext _context, IMapper _mapper) : ControllerBase
    {
        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> CreateBrand([FromBody] BrandCreateDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid order item data.");
            }

            var existingBrand = await _context.Brands.FirstOrDefaultAsync(b => b.BrandName == dto.BrandName);
            if (existingBrand != null)
            {
                return BadRequest("Brand with this name already exists.");
            }

            var brand = _mapper.Map<Brand>(dto);
            _context.Brands.Add(brand);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBrands), new { id = brand.Id }, brand);
        }

        [HttpGet]
        [Route("Get")]
        public async Task<ActionResult<IEnumerable<BrandGetDTO>>> GetBrands()
        {
            var brands = await _context.Brands.ToListAsync();
            return Ok(_mapper.Map<IEnumerable<BrandGetDTO>>(brands));
        }

        [HttpGet]
        [Route("Get/{id}")]
        public async Task<ActionResult<BrandGetDTO>> GetBrandById(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound("Brand not found.");

            return Ok(_mapper.Map<BrandGetDTO>(brand));
        }

        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateBrand(int id, [FromBody] BrandCreateDTO dto)
        {
            if (dto == null)
                return BadRequest("Invalid data.");

            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound("Brand not found.");

            _mapper.Map(dto, brand);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteBrand(int id)
        {
            var brand = await _context.Brands.FindAsync(id);
            if (brand == null)
                return NotFound("Brand not found.");

            _context.Brands.Remove(brand);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
