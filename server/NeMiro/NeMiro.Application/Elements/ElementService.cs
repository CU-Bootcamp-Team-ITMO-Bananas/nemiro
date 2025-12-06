using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Application.DTOs;
using NeMiro.Infrastructure.Repositories.Elements;
using NeMiro.Models.Elements;

namespace NeMiro.Application.Elements;

public class ElementService : IElementService
{
    private readonly IElementRepository _elementRepository;

    private IDictionary<string, IDictionary<string, ElementDto>> _elements;

    public ElementService(IElementRepository elementRepository)
    {
        _elementRepository = elementRepository;
        _elements = new Dictionary<string, IDictionary<string, ElementDto>>();
    }

    public IList<ElementDto> GetBoardElements(string boardId)
    {
        return _elements.TryGetValue(boardId, out var boardElements) ? boardElements.Values.ToList() : [];
    }

    public async Task AddElementAsync(ElementDto element, string boardId, CancellationToken cancellationToken)
    {
        var domainElement = new Element()
        {
            Id = element.Id,
            BoardId = boardId,
            CreatedAt = DateTimeOffset.Now,
            Content = element.Content,
        };

        await _elementRepository.Create(domainElement, cancellationToken);

        _elements.Add(
            boardId,
            new Dictionary<string, ElementDto>
            {
                { element.Id, element },
            });
    }

    public async Task UpdateElement(ElementDto element, string boardId, CancellationToken cancellationToken)
    {
        if (_elements.TryGetValue(boardId, out var boardElements))
        {
            if (boardElements.TryGetValue(element.Id, out var elementDto))
            {
                boardElements.Remove(element.Id);
            }
            boardElements.Add(element.Id, element);
            var newElement = new Element()
            {
                Id = element.Id,
                BoardId = boardId,
                CreatedAt = DateTimeOffset.UtcNow,
                Content = element.Content,
                UpdatedAt = DateTimeOffset.UtcNow
            };
            await _elementRepository.UpdateBatch([newElement], cancellationToken);
        }
    }

    public async Task DeleteElement(ElementDto element, string boardId, CancellationToken cancellationToken)
    {
        await _elementRepository.Delete(element.Id, cancellationToken);
        if (_elements.TryGetValue(boardId, out var boardElements))
        {
            if (boardElements.TryGetValue(element.Id, out var elementDto))
            {
                boardElements.Remove(element.Id);
            }
        }
    }
}
