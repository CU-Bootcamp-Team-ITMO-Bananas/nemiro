using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using NeMiro.Application.Auth;
using NeMiro.Models.Auth;
using NeMiro.Models.Users;

namespace NeMiro.Presentation.Controllers;

[Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost]
    public async Task<ActionResult<User>> Login([FromBody] AuthRequest request, CancellationToken ct)
    {
        return await _authService.Login(request);
    }
}
