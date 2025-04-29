using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ShoesShop.Models;
using ShoesShop.Service;
using ShoesShop.Service.DTOs.User;

namespace ShoesShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(UserManager<ApplicationUser> _userManager, IMapper _mapper, IWebHostEnvironment _environment) : ControllerBase
    {
        [HttpGet("userinfo")]
        [Authorize]
        public async Task<IActionResult> GetUserInfo()
        {
            var id = HttpContext.User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(id))
                return NotFound();

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return BadRequest("User not found");

            var userDTO = _mapper.Map<UserDTO>(user);
            userDTO.Roles = await _userManager.GetRolesAsync(user);
            return Ok(userDTO);
        }

        [HttpPut("avatar")]
        [Authorize]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> UpdateUserAvatar([FromForm]IFormFile file)
        {
            var id = HttpContext.User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(id))
                return NotFound();

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return BadRequest("User not found");

            if(!FileManager.IsFileAllowed(Path.GetExtension(file.FileName)))
                return BadRequest("Wrong file format! Allowed formats: .jpg, .jpeg, .png, .gif");

            if (user.Photo != "default-avatar.png")
                FileManager.DeleteFile(Path.Combine(_environment.ContentRootPath, "Photos", user.Photo));

            user.Photo = await FileManager.SaveFileAsync(file, _environment.ContentRootPath, "Photos");

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return BadRequest("Failed to update user avatar.");

            return Ok(user.Photo);
        }

        [HttpPut("updateinfo")]
        [Authorize]
        public async Task<IActionResult> UpdateUserInfo([FromBody]UserDTO model)
        {
            var id = HttpContext.User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(id))
                return NotFound();

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return BadRequest("User not found");

            user.UserName = model.UserName ?? user.UserName;
            user.PhoneNumber = model.PhoneNumber ?? user.PhoneNumber;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return BadRequest("Failed to update user info.");

            return Ok("Updated user info!");
        }

        [HttpGet("checkrole")]
        public async Task<IActionResult> IsAdmin()
        {
            var id = HttpContext.User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(id))
                return Ok();

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return BadRequest("User not found");

            var flag = await _userManager.IsInRoleAsync(user, "Admin");
            return flag ? Ok(flag) : Unauthorized(new { message = "denied" });
        }

        [HttpPut("updatepass")]
        [Authorize]
        public async Task<IActionResult> UpdateUserPassword([FromBody] PasswordDTO model)
        {
            var id = HttpContext.User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(id))
                return BadRequest(new { message = "User Id not found" });

            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return BadRequest(new { message = "User not found" });

            var passwordCheck = await _userManager.CheckPasswordAsync(user, model.Password);
            if (!passwordCheck)
                return BadRequest(new { message = "The old password is incorrect." });

            var passwordChange = await _userManager.ChangePasswordAsync(user, model.Password, model.NewPassword);
            if (!passwordChange.Succeeded)
                return BadRequest(new { message = "Failed to change user password." });

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(new { message = "Failed to update user password." });

            return Ok("Updated user password!");
        }

    }
}
