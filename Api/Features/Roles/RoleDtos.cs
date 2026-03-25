namespace Api.Features.Roles;

public sealed record CreateRoleRequest(string Name);
public sealed record UpdateRoleRequest(int Id, string Name);
public sealed record RoleResponseDto
{
  public int Id { get; init; }
  public string Name { get; init; } = default!;
}
