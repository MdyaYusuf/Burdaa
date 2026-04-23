namespace Api.Features.Rollcalls;

public sealed record CreateRollcallRequest(
  string Title,
  string? Description,
  DateTime Date,
  TimeSpan? StartTime,
  TimeSpan? EndTime,
  Guid GroupId,
  List<CreateRollcallEntryDto> Entries);

public sealed record CreateRollcallEntryDto(
  Guid MemberId,
  AttendanceStatus Status,
  string? Note);

public class UpdateRollcallRequest
{
  public Guid Id { get; set; }
  public string Title { get; set; } = null!;
  public string? Description { get; set; }
  public DateTime Date { get; set; }
  public TimeSpan? StartTime { get; set; }
  public TimeSpan? EndTime { get; set; }
  public List<UpdateRollcallEntryDto> Entries { get; set; } = new();
}

public class UpdateRollcallEntryDto
{
  public Guid? Id { get; set; }
  public Guid MemberId { get; set; }
  public AttendanceStatus Status { get; set; }
  public string? Note { get; set; }
}

public class RollcallResponseDto
{
  public Guid Id { get; set; }
  public string Title { get; set; } = null!;
  public string? Description { get; set; }
  public DateTime Date { get; set; }
  public TimeSpan? StartTime { get; set; }
  public TimeSpan? EndTime { get; set; }
  public Guid GroupId { get; set; }
  public string GroupName { get; set; } = null!;
  public List<RollcallEntryResponseDto> Entries { get; set; } = new();
  public DateTime CreatedDate { get; set; }
}

public class RollcallEntryResponseDto
{
  public Guid Id { get; set; }
  public Guid MemberId { get; set; }
  public string? ExternalId { get; set; }
  public string MemberFirstName { get; set; } = null!;
  public string MemberLastName { get; set; } = null!;
  public AttendanceStatus Status { get; set; }
  public string? Note { get; set; }
  public string? ProfileImageUrl { get; set; }
}

public sealed record CreatedRollcallResponseDto(
  Guid Id,
  string Title);

public sealed record RollcallPreviewDto
{
  public Guid Id { get; init; }
  public required string Title { get; init; }
  public Guid GroupId { get; init; }
  public required string GroupName { get; init; }
  public DateTime Date { get; init; }
  public int TotalPresent { get; set; }
  public int TotalAbsent { get; set; }
  public int TotalLate { get; set; }
}