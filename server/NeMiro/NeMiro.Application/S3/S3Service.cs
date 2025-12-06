using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;
using NeMiro.Application.Options;
using NeMiro.Models.S3;

namespace NeMiro.Application.S3;

public class S3Service : IS3Service
{
    private readonly IMinioClient _minioClient;

    private readonly S3Settings _settings;

    private readonly ILogger<S3Service> _logger;

    public S3Service(
        IOptions<S3Settings> settings,
        ILogger<S3Service> logger)
    {
        _settings = settings.Value;
        _logger = logger;

        _minioClient = new MinioClient()
            .WithEndpoint(_settings.ServiceUrl)
            .WithCredentials(_settings.AccessKey, _settings.SecretKey)
            .WithSSL()
            .WithRegion("ru1")
            .Build();
    }

    public async Task<S3FileResponse> UploadFile(
        Stream fileStream,
        string fileName,
        string contentType,
        CancellationToken cancellationToken)
    {
        var uniqueFileName = GenerateUniqueFileName(fileName);

        try
        {
            var bucketExistsArgs = new BucketExistsArgs()
                .WithBucket(_settings.BucketName);

            var bucketExists = await _minioClient.BucketExistsAsync(bucketExistsArgs, cancellationToken);

            if (!bucketExists)
            {
                throw new ApplicationException($"Bucket '{_settings.BucketName}' does not exist");
            }

            using var memoryStream = new MemoryStream();
            await fileStream.CopyToAsync(memoryStream, cancellationToken);
            memoryStream.Position = 0;

            var putObjectArgs = new PutObjectArgs()
                .WithBucket(_settings.BucketName)
                .WithObject(uniqueFileName)
                .WithStreamData(memoryStream)
                .WithObjectSize(memoryStream.Length)
                .WithContentType(contentType);

            await _minioClient.PutObjectAsync(putObjectArgs, cancellationToken);

            var url = $"https://{_settings.BucketName}.{_settings.ServiceUrl}/{uniqueFileName}";

            return new S3FileResponse
            {
                FileName = fileName,
                ContentType = contentType,
                Size = memoryStream.Length,
                Url = url,
                Key = uniqueFileName,
                UploadDate = DateTimeOffset.UtcNow,
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file using Minio client");
            throw new ApplicationException($"Error uploading file: {ex.Message}", ex);
        }
    }

    private static string GenerateUniqueFileName(string originalFileName)
    {
        var extension = Path.GetExtension(originalFileName);
        var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(originalFileName);

        var safeFileName = Path.GetInvalidFileNameChars()
            .Aggregate(fileNameWithoutExtension, (current, c) => current.Replace(c, '_'));

        return $"{safeFileName}_{DateTimeOffset.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid():N}{extension}";
    }
}
