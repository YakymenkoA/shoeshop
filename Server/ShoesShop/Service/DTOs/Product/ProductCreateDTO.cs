using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoesShop.Service.DTOs.Product
{
    public class ProductCreateDTO
    {
        public string? ProductName { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public int Discount { get; set; }
        public double Rating { get; set; }

        public IFormFile? PhotoFile { get; set; }
    }
}
