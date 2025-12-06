using System.Threading;
using System.Threading.Tasks;
using NeMiro.Models.Auth;
using NeMiro.Models.Users;

namespace NeMiro.Application.Auth;

public interface IAuthService
{
    Task<User> Login(AuthRequest request, CancellationToken cancellationToken);
}
