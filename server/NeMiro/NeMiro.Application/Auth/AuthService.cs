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

        var newUser = new User(
            Id: request.Id,
            Username: request.FirstName,
            Avatar: request.PhotoUrl,
            Telegram: request.Id
        );

        await userRepository.Create(newUser, cancellationToken);

        return newUser;
    }
}
