namespace ShoesShop.Service.DTOs.Product
{
    public class ProductUpdateDTO
    {
        public int Id { get; set; }
        public string? ProductName { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public int CategoryId { get; set; }
        public int BrandId { get; set; }
        public int Discount { get; set; }
        public IFormFile? PhotoFile { get; set; }
    }
}
