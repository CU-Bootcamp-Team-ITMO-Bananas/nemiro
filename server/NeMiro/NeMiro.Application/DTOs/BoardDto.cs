using System.Collections.Generic;
using NeMiro.Models.Users;

namespace NeMiro.Application.DTOs;

public class BoardDto
{
    public required string Id { get; init; }

    public required IList<User> Users { get; init; }

    public required IList<Pointer> Pointers { get; init; }
}
