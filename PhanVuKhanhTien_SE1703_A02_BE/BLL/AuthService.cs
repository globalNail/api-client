using DAL.DTO;

namespace BLL;

public class AuthService : IAuthService
{
    private readonly IJwtService _jwtService;

    public AuthService(IJwtService jwtService)
    {
        _jwtService = jwtService;
    }

    public Task<LoginResponse> Authenticate(LoginRequest request)
    {
        throw new NotImplementedException();
    }
}
