using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoesShop.Data;
using ShoesShop.Models;
using ShoesShop.Service;
using ShoesShop.Service.DTOs.Product;

namespace ShoesShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController(ApplicationDbContext _context, IMapper _mapper, IWebHostEnvironment _webEnv) : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetProducts()
        {

            var products = await _context.Products
               .Include(product => product.Category)
               .Include(product => product.Brand)
               .OrderByDescending(c => c.Id)
               .ToListAsync();

            var productsDto =
                _mapper.Map<IEnumerable<ProductGetDTO>>(products).ToList();

            return Ok(productsDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductGetDTO>> GetProductById(int id)
        {
            var product = await _context.Products
                .Where(p => p.Id == id)
                .Include(p => p.Category)
                .Include(p => p.Brand)
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound();
            }

            return _mapper.Map<ProductGetDTO>(product);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] ProductCreateDTO dto)
        {
            string fileName = "default.png";
            if (dto.PhotoFile != null)
            {
                if (!FileManager.IsFileAllowed(Path.GetExtension(dto.PhotoFile.FileName)))
                    return BadRequest("Wrong file format! Allowed formats: .jpg, .jpeg, .png, .gif");
                fileName = await FileManager.SaveFileAsync(dto.PhotoFile, _webEnv.ContentRootPath, "Photos");
            }  

            var newProduct = _mapper.Map<Product>(dto);
            newProduct.Photo = fileName;
            await _context.Products.AddAsync(newProduct);
            await _context.SaveChangesAsync();
            return Ok(newProduct);
        }

    }
}
