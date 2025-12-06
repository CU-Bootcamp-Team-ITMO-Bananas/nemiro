using System;
using System.Threading.Tasks;
using NeMiro.Application.Boards;
using NeMiro.Application.DTOs;

namespace NeMiro.Presentation.Hubs;

using Microsoft.AspNetCore.SignalR;

public class BoardHub : Hub
{
    private readonly IBoardsService _boardService;

    private readonly IHubContext<BoardHub> _hubContext;

    public BoardHub(IBoardsService boardService, IHubContext<BoardHub> hubContext)
    {
        _boardService = boardService;
        _hubContext = hubContext;
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

        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"board-{boardId}", cancellationToken);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task UpdatePointer(PointerDto pointer)
    {
        var userId = (long)Context.Items["user_id"]!;
        var boardId = Context.Items["board_id"] as string;

        var board = _boardService.GetBoardByIdAsync(boardId);

        await Clients.OthersInGroup($"board-{boardId}")
            .SendAsync(
                "BoardUpdate",
                board);
    }
}
