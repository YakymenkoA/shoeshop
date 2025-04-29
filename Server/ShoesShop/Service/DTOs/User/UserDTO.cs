namespace ShoesShop.Service.DTOs.User
{
    public class UserDTO
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Photo { get; set; }
        public IList<string>? Roles { get; set; }
    }
}
