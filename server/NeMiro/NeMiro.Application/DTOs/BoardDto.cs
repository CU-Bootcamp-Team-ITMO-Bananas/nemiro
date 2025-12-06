using System.Collections.Generic;
using NeMiro.Models.Users;

namespace NeMiro.Application.DTOs;

public class BoardDto
{
    public string Id { get; init; }

    public IList<User> Users { get; init; }

    public IList<Pointer> Pointers { get; init; }

    public IList<ElementDto> Elements { get; init; }
}
