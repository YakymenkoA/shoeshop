using Microsoft.EntityFrameworkCore;

namespace ShoesShop.Service.DTOs.CartItem
{
    public class CartItemGetDTO
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? Photo {  get; set; }
        public string? BrandName { get; set; }
        public string? CategoryName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public double Rating { get; set; }
        public bool IsChecked { get; set; }
        public string? ShoeSize { get; set; }
    }
}
