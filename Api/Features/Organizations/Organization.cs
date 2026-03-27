using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Groups;
using Api.Features.Users;

namespace Api.Features.Organizations;

public class Organization : Entity<Guid>
{
  [SetsRequiredMembers]
  public Organization()
  {
    Groups = new HashSet<Group>();

    Name = default!;
  }

  public required string Name { get; set; }
  public string? Address { get; set; }
  public string? LogoUrl { get; set; }

  // Navigation properties
  public Guid OwnerId { get; set; }
  public virtual User Owner { get; set; } = default!;
  public virtual ICollection<Group> Groups { get; set; }
}