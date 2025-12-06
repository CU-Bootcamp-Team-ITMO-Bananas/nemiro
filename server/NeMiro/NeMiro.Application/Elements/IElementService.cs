using System.Threading;
using System.Threading.Tasks;
using NeMiro.Application.DTOs;

namespace NeMiro.Application.Elements;

public interface IElementService
{
    Task AddElementAsync(ElementDto element, string boardId, CancellationToken cancellationToken);
}
