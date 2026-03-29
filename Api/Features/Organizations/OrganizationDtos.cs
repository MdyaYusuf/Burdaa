namespace Api.Features.Organizations;

// Requests
public sealed record CreateOrganizationRequest(
  string Name,
  string? Address,
  string? LogoUrl);
public class UpdateOrganizationRequest
{
  public Guid Id { get; set; }
  public string Name { get; set; } = null!;
  public string? Address { get; set; }
  public string? LogoUrl { get; set; }
}

// Responses
public class OrganizationResponseDto
{
  public Guid Id { get; set; }
  public string Name { get; set; } = null!;
  public string? Address { get; set; }
  public string? LogoUrl { get; set; }
  public DateTime CreatedDate { get; set; }
  public Guid OwnerId { get; set; }
  public string OwnerName { get; set; } = null!;
  public int TotalGroups { get; set; }
}
public sealed record CreatedOrganizationResponseDto(Guid Id, string Name);
public sealed record OrganizationPreviewDto(
  Guid Id,
  string Name,
  string? LogoUrl,
  int GroupCount);