namespace NeMiro.Models.Auth;

public record AuthRequest(long Id, string FirstName, string UserName, string ProtoUrl, long AuthDate, string Hash);
