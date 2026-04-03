using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Core.Security;
using Api.Features.Users;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Api.Features.Authentication;

public class AuthenticationService(
  IUserRepository _userRepository,
  UserBusinessRules _userBusinessRules,
  AuthenticationBusinessRules _authBusinessRules,
  UserMapper _mapper,
  IUnitOfWork _unitOfWork,
  IValidator<RegisterUserRequest> _registerValidator,
  IValidator<LoginRequest> _loginValidator,
  IOptions<TokenOptions> _tokenOptions,
  IHttpContextAccessor _httpContextAccessor) : IAuthenticationService
{
  private readonly TokenOptions _options = _tokenOptions.Value;

  public async Task<ReturnModel<TokenResponseDto>> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
  {
    var validationResult = await _loginValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    User? user = await _userRepository.GetAsync(
      predicate: u => u.Email == request.Email,
      include: query => query.Include(u => u.Role).Include(u => u.Organizations).Include(u => u.Groups));

    _authBusinessRules.UserCredentialsMustMatch(user, request.Password);

    TokenResponseDto tokenResponse = CreateToken(user!);

    user!.RefreshToken = GenerateRefreshToken();
    user.RefreshTokenExpiration = DateTime.Now.AddDays(_options.RefreshTokenExpiration);

    SetRefreshTokenCookie(user.RefreshToken, user.RefreshTokenExpiration.Value);

    _userRepository.Update(user);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<TokenResponseDto>()
    {
      Data = tokenResponse,
      Success = true,
      StatusCode = 200,
      Message = "Giriş başarılı."
    };
  }

  public async Task<ReturnModel<CreatedUserResponseDto>> RegisterAsync(RegisterUserRequest request, CancellationToken cancellationToken = default)
  {
    var validationResult = await _registerValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    await _userBusinessRules.EmailMustBeUniqueAsync(request.Email, cancellationToken: cancellationToken);
    await _userBusinessRules.UsernameMustBeUniqueAsync(request.Username, cancellationToken: cancellationToken);

    User createdUser = _mapper.CreateToEntity(request);
    createdUser.RoleId = 2;

    HashingHelper.CreatePasswordHash(request.Password, out string hash, out string key);
    createdUser.PasswordHash = hash;
    createdUser.PasswordKey = key;

    await _userRepository.AddAsync(createdUser, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    CreatedUserResponseDto response = _mapper.EntityToCreatedResponseDto(createdUser);

    return new ReturnModel<CreatedUserResponseDto>()
    {
      Success = true,
      Message = "Kaydınız başarıyla tamamlandı.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<TokenResponseDto>> RefreshTokenAsync(CancellationToken cancellationToken, string? refreshToken = null)
  {
    string? token = refreshToken ?? _httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];

    User? user = await _userRepository.GetAsync(
      predicate: u => u.RefreshToken == token,
      include: query => query.Include(u => u.Role).Include(u => u.Organizations).Include(u => u.Groups));

    _authBusinessRules.RefreshTokenMustBeValid(user);

    TokenResponseDto tokenResponse = CreateToken(user!);

    if (user!.RefreshTokenExpiration <= DateTime.Now.AddDays(1))
    {
      user.RefreshToken = GenerateRefreshToken();
      user.RefreshTokenExpiration = DateTime.Now.AddDays(_options.RefreshTokenExpiration);
    }

    SetRefreshTokenCookie(user.RefreshToken!, user.RefreshTokenExpiration!.Value);

    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<TokenResponseDto>()
    {
      Data = tokenResponse,
      Success = true,
      StatusCode = 200,
      Message = "Oturum tazelendi."
    };
  }

  public async Task<ReturnModel<NoData>> RevokeRefreshTokenAsync(CancellationToken cancellationToken, string? refreshToken = null)
  {
    string? token = refreshToken ?? _httpContextAccessor.HttpContext?.Request.Cookies["refreshToken"];

    User? user = await _userRepository.GetAsync(u => u.RefreshToken == token);
    _authBusinessRules.RefreshTokenUserMustExist(user);

    user!.RefreshToken = null;
    user.RefreshTokenExpiration = null;

    DeleteRefreshTokenCookie();

    _userRepository.Update(user);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      StatusCode = 200,
      Message = "Oturum başarıyla sonlandırıldı."
    };
  }

  private void SetRefreshTokenCookie(string token, DateTime expires)
  {
    bool isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

    CookieOptions cookieOptions = new()
    {
      HttpOnly = true,
      Secure = !isDevelopment,
      SameSite = isDevelopment ? SameSiteMode.Lax : SameSiteMode.Strict,
      Expires = expires,
      Path = "/"
    };

    _httpContextAccessor.HttpContext?.Response.Cookies.Append("refreshToken", token, cookieOptions);
  }

  private void DeleteRefreshTokenCookie()
  {
    bool isDevelopment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development";

    CookieOptions cookieOptions = new()
    {
      HttpOnly = true,
      Secure = !isDevelopment,
      SameSite = isDevelopment ? SameSiteMode.Lax : SameSiteMode.Strict,
      Path = "/"
    };

    _httpContextAccessor.HttpContext?.Response.Cookies.Delete("refreshToken", cookieOptions);
  }

  private string GenerateRefreshToken()
  {
    return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
  }

  private TokenResponseDto CreateToken(User user)
  {
    List<Claim> claims = [
      new(ClaimTypes.NameIdentifier, user.Id.ToString()),
      new(ClaimTypes.Email, user.Email),
      new(ClaimTypes.Name, user.Username),
      new(ClaimTypes.Role, user.Role.Name)
    ];

    SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(_options.SecurityKey));
    SigningCredentials creds = new(key, SecurityAlgorithms.HmacSha512Signature);
    DateTime expiration = DateTime.Now.AddMinutes(_options.AccessTokenExpiration);

    JwtSecurityToken token = new(
      issuer: _options.Issuer,
      audience: _options.Audience,
      claims: claims,
      expires: expiration,
      signingCredentials: creds
    );

    string accessToken = new JwtSecurityTokenHandler().WriteToken(token);
    UserResponseDto userDto = _mapper.EntityToResponseDto(user);

    return new TokenResponseDto(
      accessToken,
      expiration,
      userDto);
  }
}