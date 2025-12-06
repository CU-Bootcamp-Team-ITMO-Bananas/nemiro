using System.Collections.Generic;
using NeMiro.Models.Users;

namespace NeMiro.Application.Users;

public class UserService : IUserService
{
    private readonly IDictionary<string, IList<User>> _boardUsers;

    public UserService()
    {
        _boardUsers = new Dictionary<string, IList<User>>();
    }
    public IList<User> GetBoardUsers(string boardId)
    {
        return _boardUsers.TryGetValue(boardId, out var user) ? user : new List<User>();
    }
}
