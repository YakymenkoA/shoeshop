using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoesShop.Data;
using ShoesShop.Models;
using ShoesShop.Service.DTOs.CartItem;

namespace ShoesShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartItemsController(ApplicationDbContext _context, IMapper _mapper) : ControllerBase
    {

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<CartItemGetDTO>>> GetCartItems()
        {
            var id = HttpContext.User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(id))
                return BadRequest();

            var cartItems = await _context.CartItems.Where(ci => ci.UserId == id)
              .Include(cartItem => cartItem.Product).ThenInclude(p => p!.Brand)
              .Include(cartItem => cartItem.Product).ThenInclude(p => p!.Category)
              .OrderByDescending(c => c.Id)
              .ToListAsync();

            var convertedCartItems =
                _mapper.Map<IEnumerable<CartItemGetDTO>>(cartItems);

            return Ok(convertedCartItems);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CartItem>> GetCartItem(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);

            if (cartItem == null)
            {
                return NotFound();
            }

            return cartItem;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCartItem([FromBody]CartItemCreateDTO dto)
        {
            var id = HttpContext.User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(id))
                return BadRequest(new { message = "Please sign in before adding to cart." });

            var cartItem = await _context.CartItems.Where(ci => ci.ProductId == dto.ProductId && ci.UserId == id).FirstOrDefaultAsync();
            if(cartItem == null)
            {
                var newCartItem = _mapper.Map<CartItem>(dto);
                newCartItem.UserId = id;
                await _context.CartItems.AddAsync(newCartItem);
            }
            else
            {
                cartItem.Quantity += dto.Quantity;
                cartItem.Price = dto.Price;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "CartItem Created Successfully!" });
        }


        [HttpPut("update")]
        public async Task<IActionResult> UpdateCartItem([FromBody] CartItemUpdateDTO dto)
        {
            var cartItem = await _context.CartItems.Where(ci => ci.Id == dto.Id).FirstAsync();
            if (dto.Quantity != 0)
            {
                cartItem.Quantity = dto.Quantity;
            }
            if (!string.IsNullOrEmpty(dto.ShoeSize))
            {
                cartItem.ShoeSize = dto.ShoeSize;
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("quantity")]
        [Authorize]
        public async Task<IActionResult> GetCartItemQuantity()
        {
            var id = HttpContext.User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(id))
                return NotFound();

            var quantity = await _context.CartItems.Where(c => c.UserId == id).SumAsync(c => c.Quantity);

            return Ok(quantity);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCartItem(int id)
        {
            var cartItem = await _context.CartItems.FindAsync(id);
            if (cartItem == null)          
                return NotFound();
            

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
