using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using NeMiro.Models.S3;

namespace NeMiro.Application.S3;

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;

    private readonly string _bucketName;

    private readonly ILogger<S3Service> _logger;

    public S3Service(
        IAmazonS3 s3Client,
        IConfiguration configuration,
        ILogger<S3Service> logger)
    {
        _s3Client = s3Client;
        _bucketName = configuration["AWS:BucketName"]
                      ?? throw new ArgumentNullException(nameof(s3Client));
        _logger = logger;
    }

    public async Task<S3FileResponse> UploadFileAsync(
        Stream fileStream,
        string fileName,
        string contentType,
        CancellationToken cancellationToken)
    {
        try
        {
            var uniqueFileName = GenerateUniqueFileName(fileName);

            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = uniqueFileName,
                InputStream = fileStream,
                ContentType = contentType,
                Metadata =
                {
                    ["x-amz-meta-original-filename"] = fileName,
                },
                CannedACL = S3CannedACL.PublicRead,
            };

            var response = await _s3Client.PutObjectAsync(putRequest, cancellationToken);

            var url = await GetFileUrlAsync(uniqueFileName);

            return new S3FileResponse
            {
                FileName = fileName,
                ContentType = contentType,
                Size = fileStream.Length,
                Url = url,
                Key = uniqueFileName,
                UploadDate = DateTimeOffset.UtcNow,
            };
        }
        catch (AmazonS3Exception ex)
        {
            _logger.LogError(ex, "Error uploading file to S3. File: {FileName}", fileName);
            throw new ApplicationException($"Error uploading file to S3: {ex.Message}", ex);
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

    private async Task<string> GetFileUrlAsync(string key)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = key,
            Expires = DateTime.UtcNow.AddHours(24),
        };

        return await _s3Client.GetPreSignedURLAsync(request);
    }
}
