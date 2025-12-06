using System.Collections.Generic;
using NeMiro.Models.Users;

namespace NeMiro.Application.DTOs;

public class BoardDto
{
    public BoardDto(string id, IList<User> users, IList<Pointer> pointers)
    {
        Id = id;
        Users = users;
        Pointers = pointers;
    }

    public string Id { get; init; }

    public IList<User> Users { get; init; }

    public IList<Pointer> Pointers { get; init; }
}
