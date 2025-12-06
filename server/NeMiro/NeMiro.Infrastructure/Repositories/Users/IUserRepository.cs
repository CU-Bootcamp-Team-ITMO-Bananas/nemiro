using System.Threading;
using System.Threading.Tasks;
using NeMiro.Models.Users;

namespace NeMiro.Infrastructure.Repositories.Users;

public interface IUserRepository
{
    Task<User?> GetUserAsync(long userId, CancellationToken cancellationToken);
    Task<long> Create(User user, CancellationToken cancellationToken);
}
