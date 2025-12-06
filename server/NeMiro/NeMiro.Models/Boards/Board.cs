using System;

namespace NeMiro.Models.Boards;

public record Board(string Id, long OwnerId, DateTimeOffset CreatedAt, DateTimeOffset? UpdatedAt);
