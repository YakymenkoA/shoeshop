using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using ShoesShop.Models;
using ShoesShop.Service.DTOs.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace ShoesShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(UserManager<ApplicationUser> _userManager, RoleManager<IdentityRole> _roleManager, IConfiguration _configuration) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthDTO model)
        {
            if (!IsValidEmail(model.Email!))
                return BadRequest(new { message = "Invalid email address" });

            var userByEmail = await _userManager.FindByEmailAsync(model.Email!);
            if (userByEmail != null)
                return BadRequest(new { message = "User already exists" });

            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password!);
            if (result.Succeeded)
            {
                if (!await _roleManager.RoleExistsAsync("User"))
                {
                    var roleResult = await _roleManager.CreateAsync(new IdentityRole("User"));
                    if (!roleResult.Succeeded)
                    {
                        await _userManager.DeleteAsync(user);
                        return BadRequest(new { message = "User role creation failed" });
                    }
                }

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmationLink = $"http://localhost:3000/emailconfirm?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(user.Email)}";
                
                var client = new SmtpClient("sandbox.smtp.mailtrap.io", 2525)
                {
                    Credentials = new NetworkCredential("9fc940969ae6b6", "903643a8b61941"),
                    EnableSsl = true
                };
                var message = new MailMessage("shoesshop@shop.com", user.Email)
                {
                    Subject = "Confirm Your Email",
                    IsBodyHtml = true,
                    Body = $@"
                        <html>
                            <body>
                                <p>Hi there,</p>
                                <p>Please click the button below to confirm your email address:</p>
                                <a href='{confirmationLink}' style='display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-align: center; text-decoration: none; border-radius: 5px;'>Confirm Your Email</a>
                                <p>If you did not request this, please ignore this email.</p>
                            </body>
                        </html>
                    "
                };
                client.Send(message);

                await _userManager.AddToRoleAsync(user, "User");

                return Ok(new { message = "Registration successful. Please check your email for confirmation." });
            }

            return BadRequest(new { message = "Registration failed" });
        }

        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return BadRequest(new { message = "Invalid email." });

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded)
                return BadRequest(new { message = "Email confirmation failed." });

            return Ok(new { message = "Email confirmed successfully. You can now log in." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthDTO model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email!);

            if (user == null)
                return Unauthorized(new { message = "User not found!" });

            if (!await _userManager.IsEmailConfirmedAsync(user))
                return Unauthorized(new { message = "Email is not confirmed" });

            if (await _userManager.CheckPasswordAsync(user, model.Password!))
            {
                var authClaims = new List<Claim>()
                {
                    new(JwtRegisteredClaimNames.Sub, user.UserName!),
                    new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new(JwtRegisteredClaimNames.Email, user.Email!),
                    new("userId", user.Id)
                };
                var userRoles = await _userManager.GetRolesAsync(user);
                authClaims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role)));

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Issuer"],
                    expires: DateTime.Now.AddMinutes(double.Parse(_configuration["Jwt:ExpiryMinutes"]!)),
                    claims: authClaims,
                    signingCredentials:
                        new SigningCredentials(
                            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)),
                            SecurityAlgorithms.HmacSha256
                        )
                );

                var handledToken = new JwtSecurityTokenHandler().WriteToken(token);

                var cookieOptions = new CookieOptions
                {
                    HttpOnly = false,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddMinutes(
                    double.Parse(_configuration["Jwt:ExpiryMinutes"] ?? "")),
                    Path = "/"
                };

                Response.Cookies.Append("jwt", handledToken, cookieOptions);
                Response.Cookies.Append("id", user.Id, cookieOptions);

                return Ok("Success");
            }
            return Unauthorized(new { message = "Invalid Email or Password!" });
        }

        private static bool IsValidEmail(string email)
        {
            try
            {
                var address = new System.Net.Mail.MailAddress(email);
                return (address.Address == email);
            }
            catch
            {
                return false;
            }
        }
    }
}
