using Microsoft.EntityFrameworkCore;
using ShoesShop.Service.DTOs.CartItem;

namespace ShoesShop.Service.DTOs.Order
{
    public class OrderCreateDTO
    {
        public decimal TotalPrice { get; set; }
        public string? PromoCode { get; set; }
        public List<CartItemToOrderDTO> Items { get; set; } = [];

    }
}
