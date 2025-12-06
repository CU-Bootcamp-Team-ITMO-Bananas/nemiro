using System.Threading;
using System.Threading.Tasks;
using NeMiro.Application.Boards;
using NeMiro.Models.Boards;

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

    public async Task<Board?> JoinBoard(string boardId, CancellationToken cancellationToken)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"board-{boardId}", cancellationToken);

        await _hubContext.Clients.All.SendCoreAsync("board_update", new object[] { boardId }, cancellationToken);

        return await _boardService.GetBoardByIdAsync(boardId, cancellationToken);
    }
}

