using System.Threading;
using System.Threading.Tasks;
using NeMiro.Application.DTOs;
using NeMiro.Models.Boards;

namespace NeMiro.Application.Boards;

public interface IBoardsService
{
    BoardDto GetBoardByIdAsync(string boardId);
    Task<string> CreateBoard(long userId, CancellationToken cancellationToken);
    Task UpdateBoard(UpdateBoardRequest request, CancellationToken cancellationToken);
}
