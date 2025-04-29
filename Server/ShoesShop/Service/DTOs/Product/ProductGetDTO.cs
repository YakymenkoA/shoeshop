using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoesShop.Service.DTOs.Product
{
    public class ProductGetDTO
    {
        public int Id { get; set; }
        public  string? ProductName { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public int BrandId { get; set; }
        public string? BrandName { get; set; }
        public int Discount { get; set; }
        public string? PhotoSource { get; set; }
        public string? Photo { get; set; }
        public double Rating { get; set; }
        public int Quantity { get; set; }
    }
}
