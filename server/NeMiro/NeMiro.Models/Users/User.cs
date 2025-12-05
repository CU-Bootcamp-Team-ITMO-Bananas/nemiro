using System;

namespace NeMiro.Models.Users;

public record User(Guid Id, string Name, string Avatar, long Telegram);
