namespace Api.Features.Rollcalls;

// Requests
public sealed record CreateRollcallRequest(
  string Title,
  string? Description,
  DateTime Date,
  Guid GroupId,
  List<CreateRollcallEntryDto> Entries);
public sealed record CreateRollcallEntryDto(
  Guid MemberId,
  bool IsPresent,
  string? Note);
public class UpdateRollcallRequest
{
  public Guid Id { get; set; }
  public string Title { get; set; } = null!;
  public string? Description { get; set; }
  public DateTime Date { get; set; }
  public List<UpdateRollcallEntryDto> Entries { get; set; } = new();
}
public class UpdateRollcallEntryDto
{
  public Guid? Id { get; set; }
  public Guid MemberId { get; set; }
  public bool IsPresent { get; set; }
  public string? Note { get; set; }
}

// Responses
public class RollcallResponseDto
{
  public Guid Id { get; set; }
  public string Title { get; set; } = null!;
  public string? Description { get; set; }
  public DateTime Date { get; set; }
  public Guid GroupId { get; set; }
  public string GroupName { get; set; } = null!;
  public List<RollcallEntryResponseDto> Entries { get; set; } = new();
  public DateTime CreatedDate { get; set; }
}
public class RollcallEntryResponseDto
{
  public Guid Id { get; set; }
  public Guid MemberId { get; set; }
  public string MemberFirstName { get; set; } = null!;
  public string MemberLastName { get; set; } = null!;
  public bool IsPresent { get; set; }
  public string? Note { get; set; }
}
public sealed record CreatedRollcallResponseDto(Guid Id, string Title);
public sealed record RollcallPreviewDto
{
  public Guid Id { get; init; }
  public required string Title { get; init; }
  public DateTime Date { get; init; }
  public int TotalPresent { get; init; }
  public int TotalAbsent { get; init; }
}