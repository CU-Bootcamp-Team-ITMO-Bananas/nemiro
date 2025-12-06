using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NeMiro.Application.S3;

namespace NeMiro.Presentation.Controllers;

[Route("api/v1/files")]
public class FilesController(
    IS3Service s3Service,
    ILogger<FilesController> logger) : ControllerBase
{
    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadFile(
        IFormFile file,
        CancellationToken cancellationToken)
    {
        if (file.Length == 0)
            return BadRequest("No file provided");
        try
        {
            await using var stream = file.OpenReadStream();
            var result = await s3Service.UploadFile(
                stream,
                file.FileName,
                file.ContentType,
                cancellationToken);

            return new OkObjectResult(
                new
                {
                    success = true,
                    data = result,
                    message = "File uploaded successfully",
                });
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error uploading file");
            return StatusCode(500, $"Error uploading file: {ex.Message}");
        }
    }
}
