using System.Security.Claims;

namespace BLL;

public interface IJwtService
{
    string GenerateToken(string userId, string email, string roleID);
    ClaimsPrincipal ValidateToken(string token);
    string GenerateRefreshToken();
}
