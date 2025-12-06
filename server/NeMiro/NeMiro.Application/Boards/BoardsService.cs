using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Application.DTOs;
using NeMiro.Application.Pointers;
using NeMiro.Application.Users;
using NeMiro.Infrastructure.Repositories.Boards;
using NeMiro.Models.Boards;
using NeMiro.Models.Users;

namespace NeMiro.Application.Boards;

public class BoardsService : IBoardsService
{
    private readonly Dictionary<string, BoardDto> _boardDictionary;
    private readonly IBoardRepository _boardRepository;
    private readonly IPointerService _pointerService;
    private  readonly IUserService _userService;

    public BoardsService(IBoardRepository boardRepository, IPointerService pointerService, IUserService userService)
    {
        _boardRepository = boardRepository;
        _pointerService = pointerService;
        _userService = userService;
        _boardDictionary = new Dictionary<string, BoardDto>();
    }

    public async Task<IEnumerable<Board>> GetBoards(long userId, CancellationToken cancellationToken)
    {
        return await _boardRepository.GetBoardsByUserId(userId, cancellationToken);
    }

    public BoardDto GetBoardByIdAsync(string boardId)
    {
        var pointers = _pointerService.GetBoardPointers(boardId);
        var users = _userService.GetBoardUsers(boardId);
        var board = new BoardDto(boardId, users, pointers);
        return board;
    }

    public async Task<string> CreateBoard(long userId, CancellationToken cancellationToken)
    {
        var newBoard = new Board(Guid.NewGuid().ToString(), userId, DateTimeOffset.UtcNow, null);
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

        var board = new Board(boardId, ownerId, DateTimeOffset.UtcNow, null);

        await _boardRepository.Create(
            new Board(boardId, ownerId, DateTimeOffset.UtcNow, DateTimeOffset.UtcNow),
            cancellationToken);

        return board;
    }
}
