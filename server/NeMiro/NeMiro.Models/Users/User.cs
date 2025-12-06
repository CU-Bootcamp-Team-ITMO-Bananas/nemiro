namespace NeMiro.Models.Users;

public class User
{
    public long Id { get; set; }

    public required string Username { get; set; }

    public string? Avatar { get; set; }
}
