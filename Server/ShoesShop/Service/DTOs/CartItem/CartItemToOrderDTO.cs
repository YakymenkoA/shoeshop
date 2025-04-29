namespace ShoesShop.Service.DTOs.CartItem
{
    public class CartItemToOrderDTO
    {
        public int CartItemId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
