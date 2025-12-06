using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Application.DTOs;
using NeMiro.Application.Pointers;
using NeMiro.Infrastructure.Repositories.Boards;
using NeMiro.Models.Boards;
using NeMiro.Models.Users;

namespace NeMiro.Application.Boards;

public class BoardsService : IBoardsService
{
    private readonly Dictionary<string, BoardDto> _boardDictionary;
    private readonly IBoardRepository _boardRepository;
    private readonly IPointerService _pointerService;

    public BoardsService(IBoardRepository boardRepository, IPointerService pointerService)
    {
        _boardRepository = boardRepository;
        _pointerService = pointerService;
        _boardDictionary = new Dictionary<string, BoardDto>();
    }

    public async Task<BoardDto?> GetBoardByIdAsync(string boardId, CancellationToken cancellationToken)
    {
        var pointers = _pointerService.GetBoardPointers(boardId);
        var board = new BoardDto(boardId, new List<User>(), pointers);
        return board;
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

    private async Task<Board> GetStoredOrCreateBoard(string boardId, long ownerId, CancellationToken cancellationToken)
    {
        var storedBoard = await _boardRepository.GetById(boardId, cancellationToken);
        if (storedBoard != null) return storedBoard;

        var board = new Board(boardId, ownerId, DateTimeOffset.Now, null);

        await _boardRepository.Create(
            new Board(boardId, ownerId, DateTimeOffset.UtcNow, DateTimeOffset.UtcNow),
            cancellationToken);

        return board;
    }
}
