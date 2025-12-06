using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Infrastructure.Repositories.Users;
using NeMiro.Models.Users;

namespace NeMiro.Application.Users;

public class UserService : IUserService
{
    private readonly IDictionary<string, IDictionary<long, User>> _users;

    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
        _users = new Dictionary<string, IDictionary<long, User>>();
    }

    public IList<User> GetBoardUsers(string boardId)
    {
        return _users.TryGetValue(boardId, out var users) ? users.Values.ToList() : [];
    }

    public async Task JoinBoardUser(string boardId, long userId, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetUserAsync(userId, cancellationToken);
        if (_users.TryGetValue(boardId, out var boardUsers))
        {
            boardUsers.Add(userId, user);
        }
        else
        {
            _users.Add(
                boardId,
                new Dictionary<long, User>
                {
                    { userId, user },
                });
        }
    }

    public void DisconnectUserFromBoard(string boardId, long userId)
    {
        if (_users.TryGetValue(boardId, out var boardUsers))
        {
            boardUsers.Remove(userId);
        }
    }
}
