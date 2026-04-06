using Api.Features.Users;

namespace Api.Features.Authentication;

public record TokenResponseDto(
  string AccessToken,
  DateTime Expiration,
  string RefreshToken,
  UserResponseDto User);