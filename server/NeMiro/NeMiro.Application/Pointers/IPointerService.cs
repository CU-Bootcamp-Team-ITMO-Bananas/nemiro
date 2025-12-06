using System.Collections.Generic;
using NeMiro.Application.DTOs;

namespace NeMiro.Application.Pointers;

public interface IPointerService
{
    IList<Pointer> GetBoardPointers(string boardId);
    void AddOrUpdatePointer(string boardId, long userId, PointerDto pointer);
    void RemovePointer(string boardId, long userId);
}
