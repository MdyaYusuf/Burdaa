using Api.Core.Controllers;
using Api.Features.Users;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Authentication;

[ApiController]
[Route("api/auth")]
public class AuthenticationController(IAuthenticationService _authService) : CustomBaseController
{
  [HttpPost("register")]
  public async Task<IActionResult> Register(
    [FromBody] RegisterUserRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _authService.RegisterAsync(request, cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("login")]
  public async Task<IActionResult> Login(
    [FromBody] LoginRequest request,
    CancellationToken cancellationToken)
  {
    var result = await _authService.LoginAsync(request, cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("refresh-token")]
  public async Task<IActionResult> RefreshToken([FromBody] string refreshToken, CancellationToken cancellationToken)
  {
    var result = await _authService.RefreshTokenAsync(refreshToken, cancellationToken);

    return CreateActionResult(result);
  }

  [HttpPost("revoke-token")]
  public async Task<IActionResult> RevokeToken([FromBody] string refreshToken, CancellationToken cancellationToken)
  {
    var result = await _authService.RevokeRefreshTokenAsync(refreshToken, cancellationToken);

    return CreateActionResult(result);
  }
}