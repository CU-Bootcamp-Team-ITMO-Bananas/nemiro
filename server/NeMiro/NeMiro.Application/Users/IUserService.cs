using System.Collections.Generic;
using NeMiro.Models.Users;

namespace NeMiro.Application.Users;

public interface IUserService
{
    IList<User> GetBoardUsers(string boardId);
}
