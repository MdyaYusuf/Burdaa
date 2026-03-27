using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Groups;

namespace Api.Features.Members;

public class Member : Entity<Guid>
{
  [SetsRequiredMembers]
  public Member()
  {
    FirstName = default!;
    LastName = default!;
  }

  public required string FirstName { get; set; }
  public required string LastName { get; set; }
  public string? ExternalId { get; set; }
  public bool IsActive { get; set; } = true;

  // Navigation properties
  public Guid GroupId { get; set; }
  public virtual Group Group { get; set; } = default!;
}