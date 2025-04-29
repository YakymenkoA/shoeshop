using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoesShop.Data;
using ShoesShop.Models;
using ShoesShop.Service.DTOs.OrderItem;

namespace ShoesShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemsController(ApplicationDbContext db, IMapper _mapper) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> AddOrderItem([FromBody] OrderItemCreateDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("Invalid order item data.");
            }

            var orderExists = await db.Orders.AnyAsync(o => o.Id == dto.OrderId);
            if (!orderExists)
            {
                return NotFound($"Order with ID {dto.OrderId} not found.");
            }

            var product = await db.Products.FindAsync(dto.ProductId);
            if (product == null)
            {
                return NotFound($"Product with ID {dto.ProductId} not found.");
            }

            var orderItem = _mapper.Map<OrderItem>(dto);
            await db.OrderItems.AddAsync(orderItem);
            await db.SaveChangesAsync();

            return Ok(new { Message = "Order Item Added Successfully", OrderItemId = orderItem.Id });
        }

        [HttpGet("{orderId}")]
        public async Task<ActionResult<List<OrderItemGetDTO>>> GetOrderItemsByOrderId(int orderId)
        {
            var orderItems = await db.OrderItems
                .Where(oi => oi.OrderId == orderId)
                .Include(oi => oi.Product)
                .ThenInclude(p => p.Category)
                .Include(oi => oi.Product)
                .ThenInclude(p => p.Brand)
                .ToListAsync();

            if (!orderItems.Any())
            {
                return NotFound($"No order items found for Order ID {orderId}.");
            }

            var orderItemDtos = _mapper.Map<List<OrderItemGetDTO>>(orderItems);
            return Ok(orderItemDtos);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrderItemQuantity(int id, [FromBody] int quantity)
        {
            if (quantity <= 0)
            {
                return BadRequest("Quantity must be greater than zero.");
            }

            var orderItem = await db.OrderItems.FindAsync(id);
            if (orderItem == null)
            {
                return NotFound($"Order item with ID {id} not found.");
            }

            orderItem.Quantity = quantity;
            db.OrderItems.Update(orderItem);
            await db.SaveChangesAsync();

            return Ok(new { Message = "Order Item Quantity Updated Successfully" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderItem(int id)
        {
            var orderItem = await db.OrderItems.FindAsync(id);
            if (orderItem == null)
            {
                return NotFound($"Order item with ID {id} not found.");
            }

            db.OrderItems.Remove(orderItem);
            await db.SaveChangesAsync();

            return Ok(new { Message = "Order Item Deleted Successfully", DeletedOrderItem = orderItem });
        }
    }
}
