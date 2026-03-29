namespace Api.Features.Groups;

// Requests
public sealed record CreateGroupRequest(
  string Name,
  string? Description,
  Guid OrganizationId);

public class UpdateGroupRequest
{
  public Guid Id { get; set; }
  public string Name { get; set; } = null!;
  public string? Description { get; set; }
  public bool IsActive { get; set; }
}

// Responses
public class GroupResponseDto
{
  public Guid Id { get; set; }
  public string Name { get; set; } = null!;
  public string? Description { get; set; }
  public bool IsActive { get; set; }
  public DateTime CreatedDate { get; set; }
  public Guid OrganizationId { get; set; }
  public string OrganizationName { get; set; } = null!;
  public Guid CreatorId { get; set; }
  public string CreatorName { get; set; } = null!;
  public int TotalMembers { get; set; }
  public int TotalRollcalls { get; set; }
}
public sealed record CreatedGroupResponseDto(Guid Id, string Name);
public sealed record GroupPreviewDto(
  Guid Id,
  string Name,
  string? Description,
  int MemberCount,
  bool IsActive);