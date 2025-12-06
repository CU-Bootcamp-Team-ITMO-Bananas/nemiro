using System.Threading;
using System.Threading.Tasks;
using NeMiro.Models.Users;

namespace NeMiro.Infrastructure.Repositories.Users;

public interface IUserRepository
{
    Task Create(User user, CancellationToken cancellationToken);
}
