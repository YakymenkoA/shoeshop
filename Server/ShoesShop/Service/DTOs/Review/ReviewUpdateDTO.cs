using System.ComponentModel.DataAnnotations;

namespace ShoesShop.Service.DTOs.Review
{
    public class ReviewUpdateDTO
    {
        [Range(1, 5)]
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
