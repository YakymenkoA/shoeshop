namespace ShoesShop.Service.DTOs.OrderItem
{
    public class OrderItemGetDTO
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? Description { get; set; }
        public string? Photo { get; set; }
        public double Rating { get; set; }
        public decimal Price { get; set; }
        public string? ShoeSize { get; set; }
        public string? CategoryName { get; set; }
        public string? BrandName { get; set; }
        public int Quantity { get; set; }
        public int OrderId { get; set; }
    }
}
