namespace ShoesShop.Models
{
    public class Category
    {
        public int Id { get; set; }
        public required string CategoryName { get; set; }

        // Navigation
        public ICollection<Product>? Products { get; set; }
    }
}
