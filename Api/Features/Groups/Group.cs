using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Members;
using Api.Features.Organizations;
using Api.Features.Rollcalls;
using Api.Features.Users;

namespace Api.Features.Groups;

public class Group : Entity<Guid>
{
  [SetsRequiredMembers]
  public Group()
  {
    Members = new HashSet<Member>();
    Rollcalls = new HashSet<Rollcall>();

    Name = default!;
  }

  public required string Name { get; set; }
  public string? Description { get; set; }
  public bool IsActive { get; set; } = true;

  // Navigation properties
  public Guid OrganizationId { get; set; }
  public virtual Organization Organization { get; set; } = default!;
  public Guid CreatorId { get; set; }
  public virtual User Creator { get; set; } = default!;
  public virtual ICollection<Member> Members { get; set; }
  public virtual ICollection<Rollcall> Rollcalls { get; set; }
}