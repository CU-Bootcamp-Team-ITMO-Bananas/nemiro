using System.Collections.Generic;
using System.Linq;
using NeMiro.Application.DTOs;

namespace NeMiro.Application.Pointers;

public class PointerService : IPointerService
{
    private readonly IDictionary<string, IDictionary<long, Pointer>> _pointers;

    public PointerService()
    {
        _pointers = new Dictionary<string, IDictionary<long, Pointer>>();
    }

    public IList<Pointer> GetBoardPointers(string boardId)
    {
        _pointers.TryGetValue(boardId, out var boardPointers);
        return boardPointers?.Values.ToList() ?? new List<Pointer>();
    }

    public void AddOrUpdatePointer(string boardId, long userId, PointerDto pointer)
    {
        var newPointer = new Pointer()
        {
            X = pointer.X,
            Y = pointer.Y,
            UserId = userId
        };

        if (_pointers.TryGetValue(boardId, out var boardPointers))
        {
            boardPointers.Remove(userId);
            boardPointers.Add(userId, newPointer);
        }
        else
        {
            _pointers.Add(
                boardId,
                new Dictionary<long, Pointer>()
                {
                    { userId, newPointer }
                });
        }
    }

    public void RemovePointer(string boardId, long userId)
    {
        if (_pointers.TryGetValue(boardId, out var boardPointers))
        {
            boardPointers.Remove(userId);
        }
    }
}
