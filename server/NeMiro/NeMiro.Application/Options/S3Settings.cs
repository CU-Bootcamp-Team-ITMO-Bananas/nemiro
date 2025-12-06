namespace NeMiro.Application.Options
{
    public class S3Settings
    {
        public required string ServiceUrl { get; init; }

        public required string BucketName { get; init; }

        public required string AccessKey { get; init; }

        public required string SecretKey { get; init; }

        public string Region { get; init; } = "ru-1";

        public bool ForcePathStyle { get; init; } = true;

        public bool UseHttp { get; init; } = false;

        public string? BaseUrl { get; init; }
    }
}
