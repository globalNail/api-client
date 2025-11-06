using BLL.Services;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly AccountService _accountService;

        public AuthController(IConfiguration configuration, AccountService accountService)
        {
            _configuration = configuration;
            _accountService = accountService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var account = _accountService.Authenticate(request.Email, request.Password);
            if (account == null)
            {
                return Unauthorized("Invalid credentials");
            }

            var role = GetRoleName(account.AccountRole);
            var token = GenerateJwtToken(account, role);
            return Ok(new { Token = token, Role = role });
        }

        private string GetRoleName(int accountRole)
        {
            return accountRole switch
            {
                1 => "Staff",
                2 => "Lecturer",
                _ => _configuration["AdminRole"] ?? "Admin"
            };
        }

        private string GenerateJwtToken(SystemAccount account, string role)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, account.AccountEmail),
                new Claim(ClaimTypes.Name, account.Accountname),
                new Claim(ClaimTypes.Role, role),
                new Claim("AccountId", account.AccountId.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(double.Parse(_configuration["Jwt:ExpiryInMinutes"]!)),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}