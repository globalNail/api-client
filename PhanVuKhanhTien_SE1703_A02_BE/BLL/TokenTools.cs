using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BLL;

public static class TokenTools
{
    public static JwtSecurityToken GenerateToken(List<Claim> authClaims, IConfiguration configuration, DateTime currentTime)
    {
        var jwt = configuration.GetSection("Jwt");
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Secret"]!));
        _ = int.TryParse(jwt["ExpirationInMinutes"], out int tokenValidityInMinutes);

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            expires: currentTime.AddMinutes(tokenValidityInMinutes),
            claims: authClaims,
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
        );
        return token;
    }
}
