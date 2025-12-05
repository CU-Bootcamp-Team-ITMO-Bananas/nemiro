using System;
using System.Threading.Tasks;

namespace NeMiro.Application.Boards;

public interface IBoardsService
{
    Task<Guid> CreateBoard(long userId);
}
