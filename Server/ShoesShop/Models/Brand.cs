namespace ShoesShop.Models
{
    public class Brand
    {
        public int Id { get; set; }
        public required string BrandName { get; set; }
        public string? Description { get; set; }

        // Navigation
        public ICollection<Product>? Products { get; set; }
    }
}
