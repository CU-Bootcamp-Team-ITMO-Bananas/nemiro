using System.Threading.Tasks;
using NeMiro.Models.Auth;
using NeMiro.Models.Users;

namespace NeMiro.Application.Auth;

public class AuthService : IAuthService
{
    public Task<User> Login(AuthRequest request)
    {
        throw new System.NotImplementedException();
    }
}
