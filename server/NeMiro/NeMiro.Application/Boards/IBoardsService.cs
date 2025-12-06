using System.Threading;
using System.Threading.Tasks;

namespace NeMiro.Application.Boards;

public interface IBoardsService
{
    Task<string> CreateBoard(long userId, CancellationToken cancellationToken);
}
