using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoesShop.Data;
using ShoesShop.Models;
using ShoesShop.Service;
using ShoesShop.Service.DTOs.Order;

namespace ShoesShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController(ApplicationDbContext _context, IMapper _mapper) : ControllerBase
    {
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateOrder([FromBody] OrderCreateDTO dto)
        {
            var userId = HttpContext.User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userId))
                return NotFound();

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var totalPrice = dto.TotalPrice;
                if (!string.IsNullOrEmpty(dto.PromoCode))
                {
                    var code = await _context.Promocodes.Where(p => p.Code == dto.PromoCode).FirstAsync();
                    if (code != null)
                    {
                        totalPrice = totalPrice - (totalPrice * code.Discount / 100);
                        code.AmountOfUses -= 1;
                    }
                }

                var order = new Order()
                {
                    UserId = userId,
                    TotalPrice = totalPrice,
                    Status = "Processing"
                };

                await _context.Orders.AddAsync(order);
                await _context.SaveChangesAsync();

                foreach (var item in dto.Items)
                {
                    var cartItem = await _context.CartItems.Where(c => c.Id == item.CartItemId).FirstAsync();
                    _context.CartItems.Remove(cartItem);

                    var orderItem = new OrderItem()
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        OrderId = order.Id,
                        ShoeSize = cartItem.ShoeSize,
                        Price = cartItem.Price
                    };

                    await _context.OrderItems.AddAsync(orderItem);
                    await _context.SaveChangesAsync();
                }
                await transaction.CommitAsync();
                return Ok(new { Message = "Order Created Successfully", OrderId = order.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Internal server error:{ex.Message}");
            }
        }

        [HttpGet("userorders")]
        [Authorize]
        public async Task<IActionResult> GetAllUserOrders()
        {
            var id = HttpContext.User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(id))
                return BadRequest("user id not found");

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return BadRequest("User not found");

            var orders = await _context.Orders
                .Where(o => o.UserId == id)!
                .Include(o => o.OrderItems)!
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            if (orders != null)
            {
                var orderDtos = orders.Select(o => _mapper.Map<OrderGetDTO>(o)).ToList();
                return Ok(orderDtos);
            }

            return Ok(null);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById([FromRoute] int id)
        {
            var order = await _context.Orders
                .Include(o => o.User)
                .Include(o => o.OrderItems)!
                    .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p!.Brand)
                .Include(o => o.OrderItems)!
                    .ThenInclude(oi => oi.Product)
                    .ThenInclude(p => p!.Category)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound($"Order with ID {id} not found.");
            }

            var orderDto = _mapper.Map<OrderInfoDTO>(order);

            var orderItems = await _context.OrderItems.Where(oi => oi.OrderId == id).ToListAsync();
            foreach (var item in orderDto.Products)
            {
                item.Quantity = orderItems.Where(oi => oi.ProductId == item.Id).First().Quantity;
            }

            return Ok(orderDto);
        }
    }
}
