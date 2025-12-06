namespace NeMiro.Models.Auth;

public record AuthRequest(long Id, string FirstName, string UserName, string PhotoUrl, long AuthDate, string Hash);
