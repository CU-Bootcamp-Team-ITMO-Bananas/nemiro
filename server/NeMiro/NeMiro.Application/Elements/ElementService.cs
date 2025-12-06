using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Application.DTOs;
using NeMiro.Infrastructure.Repositories.Elements;
using NeMiro.Models.Elements;

namespace NeMiro.Application.Elements;

public class ElementService : IElementService
{
    private readonly IElementRepository _elementRepository;
    private IDictionary<string, Element> _elements;

    public ElementService(IElementRepository elementRepository)
    {
        _elementRepository = elementRepository;
        _elements = new Dictionary<string, Element>();
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
}
