using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NeMiro.Application.Options;
using NeMiro.Models.S3;

namespace NeMiro.Application.S3;

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;

    private readonly S3Settings _settings;

    private readonly ILogger<S3Service> _logger;

    public S3Service(
        IOptions<S3Settings> settings,
        ILogger<S3Service> logger,
        IAmazonS3 s3Client)
    {
        _settings = settings.Value;
        _logger = logger;
        _s3Client = s3Client;

        var s3Config = new AmazonS3Config
        {
            ServiceURL = _settings.ServiceUrl,
            RegionEndpoint = RegionEndpoint.GetBySystemName(_settings.Region),
            ForcePathStyle = _settings.ForcePathStyle,
            UseHttp = _settings.UseHttp,
            Timeout = TimeSpan.FromMinutes(5),
            MaxErrorRetry = 3,
        };

        var credentials = new BasicAWSCredentials(
            _settings.AccessKey,
            _settings.SecretKey);

        _s3Client = new AmazonS3Client(credentials, s3Config);
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

            await EnsureBucketExistsAsync(cancellationToken);

            var putRequest = new PutObjectRequest
            {
                BucketName = _settings.BucketName,
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

            if (response.HttpStatusCode != HttpStatusCode.OK)
            {
                throw new ApplicationException($"Failed to upload file. Status: {response.HttpStatusCode}");
            }

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

    private async Task EnsureBucketExistsAsync(CancellationToken cancellationToken)
    {
        try
        {
            var exists = await AmazonS3Util.DoesS3BucketExistV2Async(_s3Client, _settings.BucketName);
            if (!exists)
            {
                try
                {
                    var putBucketRequest = new PutBucketRequest
                    {
                        BucketName = _settings.BucketName,
                        UseClientRegion = true,
                    };

                    await _s3Client.PutBucketAsync(putBucketRequest, cancellationToken);
                    _logger.LogInformation("Bucket created: {BucketName}", _settings.BucketName);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Failed to create bucket: {BucketName}", _settings.BucketName);
                    throw new ApplicationException(
                        $"Bucket '{_settings.BucketName}' does not exist and cannot be created. Please create it manually in Beget control panel.");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking bucket existence: {BucketName}", _settings.BucketName);
            throw;
        }
    }

    private async Task<string> GetFileUrlAsync(string key)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _settings.BucketName,
            Key = key,
            Expires = DateTime.UtcNow.AddHours(24),
        };

        return await _s3Client.GetPreSignedURLAsync(request);
    }
}
