using DAL.DTO;

namespace BLL;

public interface IAuthService
{
    Task<LoginResponse> Authenticate(LoginRequest request);
}
