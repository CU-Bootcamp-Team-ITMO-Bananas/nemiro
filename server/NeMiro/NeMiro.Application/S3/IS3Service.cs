using System.IO;
using System.Threading;
using System.Threading.Tasks;
using NeMiro.Models.S3;

namespace NeMiro.Application.S3;

public interface IS3Service
{
    Task<S3FileResponse> UploadFile(
        Stream fileStream,
        string fileName,
        string contentType,
        CancellationToken cancellationToken);
}
