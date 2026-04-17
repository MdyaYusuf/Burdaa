using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Groups;
using Api.Features.Rollcalls;

namespace Api.Features.Members;

public class Member : Entity<Guid>
{
  [SetsRequiredMembers]
  public Member()
  {
    RollcallEntries = new HashSet<RollcallEntry>();

    FirstName = default!;
    LastName = default!;
  }

  public required string FirstName { get; set; }
  public required string LastName { get; set; }
  public string? ExternalId { get; set; }
  public string? ProfileImageUrl { get; set; }
  public DateTime? BirthDate { get; set; }
  public bool IsActive { get; set; } = true;

  // Navigation properties
  public Guid GroupId { get; set; }
  public virtual Group Group { get; set; } = default!;
  public virtual ICollection<RollcallEntry> RollcallEntries { get; set; }
}