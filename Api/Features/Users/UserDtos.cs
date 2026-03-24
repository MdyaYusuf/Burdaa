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
public sealed record CreatedUserResponseDto(Guid Id, string Username);
public sealed record UserResponseDto(Guid Id, string Username, string Email, string? ProfileImageUrl, string? Bio, string RoleName);