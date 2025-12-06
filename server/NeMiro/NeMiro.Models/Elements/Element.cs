using System;
using System.Text.Json;

namespace NeMiro.Models.Elements;

public class Element
{
    public required string Id { get; init; }

    public required string BoardId { get; init; }

    public DateTimeOffset CreatedAt { get; init; }

    public required JsonDocument Content { get; init; }

    public DateTimeOffset? UpdatedAt { get; init; }
}
