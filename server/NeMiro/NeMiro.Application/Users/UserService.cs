using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Infrastructure.Repositories.Users;
using NeMiro.Models.Users;

namespace NeMiro.Application.Users;

public class UserService : IUserService
{
    private readonly IDictionary<string, IList<User>> _boardUsers;
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
        _boardUsers = new Dictionary<string, IList<User>>();
    }
    public IList<User> GetBoardUsers(string boardId)
    {
        return _boardUsers.TryGetValue(boardId, out var user) ? user : new List<User>();
    }

    public async Task JoinBoardUser(string boardId, long userId, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetUserAsync(userId, cancellationToken);
        if (_boardUsers.TryGetValue(boardId, out var value))
        {
            value.Add(user);
        }
        else
        {
            _boardUsers.Add(boardId, new List<User> { user, });
        }
    }
}
