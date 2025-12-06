using System.Text.Json;

namespace NeMiro.Application.DTOs;

public class ElementDto
{
    public required string Id { get; init; }

    public required JsonDocument Content { get; init; }
}
