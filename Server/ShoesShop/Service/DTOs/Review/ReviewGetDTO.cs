namespace ShoesShop.Service.DTOs.Review
{
    public class ReviewGetDTO
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; }
        public string? UserId { get; set; }
        public string? UserName { get; set; }
        public string? Photo { get; set; }
        public int ProductId { get; set; }
        public string? ProductName { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
