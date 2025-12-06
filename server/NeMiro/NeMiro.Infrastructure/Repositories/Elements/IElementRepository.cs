using System.Collections.Generic;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Models.Elements;

namespace NeMiro.Infrastructure.Repositories.Elements;

public interface IElementRepository
{
    Task Create(Element element, CancellationToken cancellationToken);

    Task Delete(long id, CancellationToken cancellationToken);

    Task UpdateBatch(IReadOnlyCollection<Element> elements, CancellationToken cancellationToken);
}
