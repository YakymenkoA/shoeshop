using Microsoft.EntityFrameworkCore;

namespace ShoesShop.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public required string UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }

        [Precision(18, 2)]
        public decimal Price { get; set; }
        public string? ShoeSize { get; set; }

        // Navigation
        public ApplicationUser? User { get; set; }
        public Product? Product { get; set; }
    }
}
