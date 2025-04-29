using Microsoft.EntityFrameworkCore;

namespace ShoesShop.Service.DTOs.CartItem
{
    public class CartItemCreateDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string? ShoeSize { get; set; }
    }
}
