namespace ShoesShop.Models
{
    public class Review
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; } = DateTime.UtcNow.AddHours(2);
        public required string UserId { get; set; }
        public int ProductId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }

        // Navigation
        public Product? Product { get; set; }
        public ApplicationUser? User { get; set; }
    }
}
