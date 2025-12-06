using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Models.Users;

namespace NeMiro.Application.Users;

public interface IUserService
{
    IList<User> GetBoardUsers(string boardId);
    Task JoinBoardUser(string boardId, long userId, CancellationToken cancellationToken);
}
