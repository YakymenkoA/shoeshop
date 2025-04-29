using ShoesShop.Service.DTOs.OrderItem;
using ShoesShop.Service.DTOs.Product;

namespace ShoesShop.Service.DTOs.Order
{
    public class OrderInfoDTO
    {
        public int Id { get; set; }
        public string? UserName { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Status { get; set; }
        public List<ProductGetDTO> Products { get; set; } = [];
        public List<OrderItemGetDTO> OrderItems { get; set; } = [];
    }
}
