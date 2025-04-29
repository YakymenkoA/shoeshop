using Microsoft.EntityFrameworkCore;

namespace ShoesShop.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int OrderId { get; set; }

        [Precision(18, 2)]
        public decimal Price { get; set; }
        public string? ShoeSize { get; set; }

        // Navigation
        public Order? Order { get; set; }
        public Product? Product { get; set; }
    }
}
