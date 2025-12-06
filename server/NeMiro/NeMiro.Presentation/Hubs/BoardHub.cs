using System;
using System.Threading.Tasks;
using NeMiro.Application.Boards;
using NeMiro.Application.DTOs;
using NeMiro.Application.Elements;
using NeMiro.Application.Pointers;
using NeMiro.Application.Users;

namespace NeMiro.Presentation.Hubs;

using Microsoft.AspNetCore.SignalR;

public class BoardHub : Hub
{
    private readonly IBoardsService _boardService;

    private readonly IUserService _userService;

    private readonly IPointerService _pointerService;

    private readonly IElementService _elementService;

    private readonly IHubContext<BoardHub> _hubContext;

    public BoardHub(
        IBoardsService boardService,
        IHubContext<BoardHub> hubContext,
        IUserService userService,
        IPointerService pointerService,
        IElementService elementService)
    {
        _boardService = boardService;
        _hubContext = hubContext;
        _userService = userService;
        _pointerService = pointerService;
        _elementService = elementService;
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var cancellationToken = httpContext.RequestAborted;

        var boardId = httpContext.Request.Query["board_id"].ToString();
        var userIdParam = httpContext.Request.Query["user_id"].ToString();

        long userId = 0;
        if (!string.IsNullOrEmpty(userIdParam))
        {
            long.TryParse(userIdParam, out userId);
        }
        else
        {
            Console.WriteLine("What?");
        }

        Context.Items["user_id"] = userId;
        Context.Items["board_id"] = boardId;
        await _userService.JoinBoardUser(boardId, userId, cancellationToken);

        if (!string.IsNullOrEmpty(boardId))
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"board-{boardId}", cancellationToken);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var httpContext = Context.GetHttpContext();
        var cancellationToken = httpContext.RequestAborted;
        var boardId = httpContext.Request.Query["board_id"];
        var userId = (long)Context.Items["user_id"]!;

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"board-{boardId}", cancellationToken);
        _userService.DisconnectUserFromBoard(boardId!, userId);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task UpdatePointer(PointerDto pointer)
    {
        var userId = (long)Context.Items["user_id"]!;
        var boardId = Context.Items["board_id"] as string;

        _pointerService.AddOrUpdatePointer(boardId, userId, pointer);
        var board = _boardService.GetBoardByIdAsync(boardId);

        await Clients.OthersInGroup($"board-{boardId}")
            .SendAsync(
                "BoardUpdate",
                board);
    }

    public async Task UpdateElement(ElementDto element)
    {
        var httpContext = Context.GetHttpContext();
        var cancellationToken = httpContext.RequestAborted;
        var boardId = Context.Items["board_id"] as string;

        _elementService.UpdateElement(element, boardId);
    }
}
