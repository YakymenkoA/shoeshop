namespace ShoesShop.Models
{
    public class Promocode
    {
        public int Id { get; set; }
        public string? Code { get; set; }
        public int Discount { get; set; }
        public int AmountOfUses { get; set; }

        // Navigation
        public ICollection<ApplicationUser>? Users { get; set; }
    }
}
