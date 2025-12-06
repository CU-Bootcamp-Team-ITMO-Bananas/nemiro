using System;

namespace NeMiro.Models.S3;

public class S3FileResponse
{
    public required string FileName { get; init; }

    public required string ContentType { get; init; }

    public required long Size { get; init; }

    public required string Url { get; init; }

    public required string Key { get; init; }

    public DateTimeOffset UploadDate { get; init; } = DateTimeOffset.UtcNow;
}
