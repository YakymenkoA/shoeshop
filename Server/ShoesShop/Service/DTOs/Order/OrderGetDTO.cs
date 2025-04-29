using Microsoft.EntityFrameworkCore;

namespace ShoesShop.Service.DTOs.Order
{
    public class OrderGetDTO
    {
        public int Id { get; set; }
        public string? UserName { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Status { get; set; }
        public List<string> Photos { get; set; } = [];
    }
}
