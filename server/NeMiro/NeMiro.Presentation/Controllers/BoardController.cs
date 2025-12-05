using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NeMiro.Application.Boards;

namespace NeMiro.Presentation.Controllers;

[Route("api/v1/boards")]
public class BoardController : ControllerBase
{
    private readonly IBoardsService _boardsService;

    public BoardController(IBoardsService boardsService)
    {
        _boardsService = boardsService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateBoard()
    {
        if (!Request.Headers.TryGetValue("User-Id", out var userIdHeader))
        {
            return BadRequest("User-Id header missing");
        }

        if (!long.TryParse(userIdHeader.ToString(), out var userId))
        {
            return BadRequest("User-Id is not a valid long number");
        }

        var newBoardId = await _boardsService.CreateBoard(userId);

        return new OkObjectResult(newBoardId);
    }
}
