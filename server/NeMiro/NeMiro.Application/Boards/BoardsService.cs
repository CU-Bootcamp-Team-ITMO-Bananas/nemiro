using System;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Infrastructure.Repositories.Boards;
using NeMiro.Models.Boards;

namespace NeMiro.Application.Boards;

public class BoardsService : IBoardsService
{
    private readonly IBoardRepository _boardRepository;

    public BoardsService(IBoardRepository boardRepository)
    {
        _boardRepository = boardRepository;
    }

    public async Task<Board?> GetBoardByIdAsync(string boardId, CancellationToken cancellationToken)
    {
        return await _boardRepository.GetById(boardId, cancellationToken);
    }

    public async Task<string> CreateBoard(long userId, CancellationToken cancellationToken)
    {
        var newBoard = new Board(Guid.NewGuid().ToString(), userId, DateTimeOffset.Now, null);
        await _boardRepository.Create(newBoard, cancellationToken);
        return newBoard.Id;
    }

    public Task UpdateBoard(UpdateBoardRequest request, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
