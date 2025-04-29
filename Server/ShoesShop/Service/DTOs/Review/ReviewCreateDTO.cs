using System.ComponentModel.DataAnnotations;

namespace ShoesShop.Service.DTOs.Review
{
    public class ReviewCreateDTO
    {
        public int ProductId { get; set; }

        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
