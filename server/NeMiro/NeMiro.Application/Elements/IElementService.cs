using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Application.DTOs;

namespace NeMiro.Application.Elements;

public interface IElementService
{
    IList<ElementDto> GetBoardElements(string boardId);
    Task AddElementAsync(ElementDto element, string boardId, CancellationToken cancellationToken);
    void UpdateElement(ElementDto element, string boardId);
}
