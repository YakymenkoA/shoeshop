using Microsoft.AspNetCore.Identity;

namespace ShoesShop.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Photo { get; set; } = "default-avatar.png";

        // Navigation
        public ICollection<Order>? Orders { get; set; }
        public ICollection<Promocode>? Promocodes { get; set; }
    }
}
