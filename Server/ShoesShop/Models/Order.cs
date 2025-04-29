using Microsoft.EntityFrameworkCore;

namespace ShoesShop.Models
{
    public class Order
    {
        public int Id { get; set; }
        public required string UserId { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow.AddHours(2); // Kyiv is 2 hours ahead

        [Precision(18, 2)]
        public decimal TotalPrice { get; set; }
        public string? Status { get; set; }

        // Navigation
        public ApplicationUser? User { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}
