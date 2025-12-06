using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Application.DTOs;
using NeMiro.Infrastructure.Repositories.Boards;
using NeMiro.Models.Boards;

namespace NeMiro.Application.Boards;

public class BoardsService : IBoardsService
{
    private readonly Dictionary<string, BoardDto> _boardDictionary;
    private readonly IBoardRepository _boardRepository;

    public BoardsService(IBoardRepository boardRepository)
    {
        _boardRepository = boardRepository;
        _boardDictionary = new Dictionary<string, BoardDto>();
    }

    public async Task<Board?> GetBoardByIdAsync(string boardId, CancellationToken cancellationToken)
    {
        _boardDictionary.TryGetValue(boardId, out var board);

        if (board == null)
        {
            // var storedBoard = await GetStoredOrCreateBoard(boardId, ownerId);
            // _boardDictionary.Add(
            //     boardId,
            //     new BoardDto
            //     {
            //         Id = storedBoard.Id,
            //         Users = [],
            //         Pointers = [],
            //     });
        }

        return null;
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
