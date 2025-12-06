using System.Threading;
using System.Threading.Tasks;
using NeMiro.Application.DTOs;
using NeMiro.Models.Boards;

namespace NeMiro.Application.Boards;

public interface IBoardsService
{
    Task<BoardDto?> GetBoardByIdAsync(string boardId, CancellationToken cancellationToken);
    Task<string> CreateBoard(long userId, CancellationToken cancellationToken);
    Task UpdateBoard(UpdateBoardRequest request, CancellationToken cancellationToken);
}
