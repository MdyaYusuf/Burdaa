namespace Api.Features.Users;

// Requests
public sealed record LoginRequest(string Email, string Password);
public sealed record RegisterUserRequest(string Username, string Email, string Password);
public sealed record ChangePasswordRequest(string CurrentPassword, string NewPassword, string ConfirmNewPassword);
public sealed record UpdateUserRequest(
  string Username,
  string Email,
  string? Bio,
  IFormFile? ImageFile);

// Responses
public sealed record CreatedUserResponseDto
{
  public Guid Id { get; init; }
  public string Username { get; init; } = null!;
}
public sealed record UserPreviewDto
{
  public Guid Id { get; init; }
  public string Username { get; init; } = null!;
  public string? ProfileImageUrl { get; init; }
  public string RoleName { get; init; } = null!;
}
public class UserResponseDto
{
  public Guid Id { get; set; }
  public string Username { get; set; } = null!;
  public string Email { get; set; } = null!;
  public string? Bio { get; set; }
  public string? ProfileImageUrl { get; set; }
  public bool IsActive { get; set; }
  public DateTime CreatedDate { get; set; }
  public int RoleId { get; set; }
  public string RoleName { get; set; } = null!;
  public int OrganizationCount { get; set; }
  public int GroupCount { get; set; }
}