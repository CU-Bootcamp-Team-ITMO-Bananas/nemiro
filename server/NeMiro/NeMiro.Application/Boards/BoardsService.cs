using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Application.DTOs;
using NeMiro.Application.Elements;
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

    private readonly IUserService _userService;

    private readonly IElementService _elementService;

    public BoardsService(IBoardRepository boardRepository, IPointerService pointerService, IUserService userService, IElementService elementService)
    {
        _boardRepository = boardRepository;
        _pointerService = pointerService;
        _userService = userService;
        _elementService = elementService;
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
        var elements = _elementService.GetBoardElements(boardId);
        var board = new BoardDto()
        {
            Id = boardId,
            Users = users,
            Elements = elements,
            Pointers = pointers
        };
        return board;
    }

    public async Task<string> CreateBoard(long userId, CancellationToken cancellationToken)
    {
        var newBoard = new Board
        {
            Id = Guid.NewGuid().ToString(),
            OwnerId = userId,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = null,
        };
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

        var board = new Board
        {
            Id = boardId,
            OwnerId = ownerId,
            CreatedAt = DateTimeOffset.UtcNow,
            UpdatedAt = null,
        };

        await _boardRepository.Create(board, cancellationToken);

        return board;
    }
}
