using System;

namespace NeMiro.Models.Boards;

public class Board
{
    public string Id { get; set; }

    public required long OwnerId { get; set; }

    public required DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset? UpdatedAt { get; set; }
}
