using System.Threading;
using System.Threading.Tasks;
using NeMiro.Infrastructure.Repositories.Users;
using NeMiro.Models.Auth;
using NeMiro.Models.Users;

namespace NeMiro.Application.Auth;

public class AuthService(IUserRepository userRepository) : IAuthService
{
    public async Task<User> Login(AuthRequest request, CancellationToken cancellationToken)
    {
        var existingUser = await userRepository.GetUserAsync(request.Id, cancellationToken);

        if (existingUser != null)
        {
            return existingUser;
        }

        var newUser = new User
        {
            Username = request.UserName,
            Avatar = request.PhotoUrl,
        };
        var id = await userRepository.Create(newUser, cancellationToken);

        newUser.Id = id;
        return newUser;
    }
}
