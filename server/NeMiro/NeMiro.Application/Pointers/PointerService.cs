using System.Collections.Generic;
using NeMiro.Application.DTOs;

namespace NeMiro.Application.Pointers;

public class PointerService : IPointerService
{
    private readonly IDictionary<string, IList<Pointer>> _pointers;

    public PointerService()
    {
        _pointers = new Dictionary<string, IList<Pointer>>();
    }

    public IList<Pointer> GetBoardPointers(string boardId)
    {
        _pointers.TryGetValue(boardId, out var boardPointers);
        return boardPointers ?? new List<Pointer>();
    }
}
