using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Groups;

namespace Api.Features.Rollcalls;

public class Rollcall : Entity<Guid>
{
  [SetsRequiredMembers]
  public Rollcall()
  {
    Entries = new HashSet<RollcallEntry>();

    Title = default!;
  }

  public required string Title { get; set; }
  public string? Description { get; set; }
  public DateTime Date { get; set; }

  // Navigation properties
  public Guid GroupId { get; set; }
  public virtual Group Group { get; set; } = default!;
  public virtual ICollection<RollcallEntry> Entries { get; set; }
}