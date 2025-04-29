namespace ShoesShop.Service.DTOs.CartItem
{
    public class CartItemUpdateDTO
    {
        public int Id { get; set; }
        public string? UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string? ShoeSize { get; set; }
    }
}
