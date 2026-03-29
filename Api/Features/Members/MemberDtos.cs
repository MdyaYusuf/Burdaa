namespace Api.Features.Members;

// Requests
public sealed record CreateMemberRequest(
  string FirstName,
  string LastName,
  string? ExternalId,
  Guid GroupId);
public class UpdateMemberRequest
{
  public Guid Id { get; set; }
  public string FirstName { get; set; } = null!;
  public string LastName { get; set; } = null!;
  public string? ExternalId { get; set; }
  public bool IsActive { get; set; }
}

// Responses
public class MemberResponseDto
{
  public Guid Id { get; set; }
  public string FirstName { get; set; } = null!;
  public string LastName { get; set; } = null!;
  public string? ExternalId { get; set; }
  public bool IsActive { get; set; }
  public Guid GroupId { get; set; }
  public string GroupName { get; set; } = null!;
  public DateTime CreatedDate { get; set; }
}
public sealed record CreatedMemberResponseDto(Guid Id, string FirstName, string LastName);
public sealed record MemberPreviewDto(
  Guid Id,
  string FirstName,
  string LastName,
  string? ExternalId,
  bool IsActive);