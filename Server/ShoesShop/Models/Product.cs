using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoesShop.Models
{
    public class Product
    {
        public int Id { get; set; }
        public required string ProductName { get; set; }

        [Precision(18,2)]
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public int Discount { get; set; }
        public string? Photo { get; set; }
        public double Rating { get; set; }

        // Navigation
        public Category? Category { get; set; }
        public Brand? Brand { get; set; }
        public ICollection<CartItem>? CartItems { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; }
        public ICollection<Review>? Reviews { get; set; }
    }
}
