using System.Threading;
using System.Threading.Tasks;
using NeMiro.Models.Boards;

namespace NeMiro.Infrastructure.Repositories.Boards;

public interface IBoardRepository
{
    Task Create(Board board, CancellationToken cancellationToken);
    Task<Board?> GetById(string id, CancellationToken cancellationToken);
}
