using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NeMiro.Application.Auth;
using NeMiro.Models.Auth;
using NeMiro.Models.Users;

namespace NeMiro.Presentation.Controllers;

[Route("api/v1/auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<User>> Login([FromBody] AuthRequest request, CancellationToken ct)
    {
        return await authService.Login(request, ct);
    }
}
