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
        if (_elements.TryGetValue(boardId, out var boardElements))
        {
            return boardElements.Values.ToList();
        }
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

        _elements.Add(boardId, domainElement);
    }

    public void UpdateElement(ElementDto element, string boardId)
    {
        if (_elements.TryGetValue(boardId, out var boardElements))
        {
            boardElements.Remove(element.Id);
            boardElements.Add(element.Id, element);
        }
    }
}
