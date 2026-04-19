using System.Diagnostics.CodeAnalysis;
using Api.Core.Entities;
using Api.Features.Members;

namespace Api.Features.Rollcalls;

public class RollcallEntry : Entity<Guid>
{
  [SetsRequiredMembers]
  public RollcallEntry()
  {

  }

  public RollcallEntry(Guid id) : base(id)
  {

  }

  public Guid RollcallId { get; set; }
  public virtual Rollcall Rollcall { get; set; } = default!;
  public Guid MemberId { get; set; }
  public virtual Member Member { get; set; } = default!;
  public AttendanceStatus Status { get; set; }
  public string? Note { get; set; }
}