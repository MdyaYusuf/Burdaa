using Riok.Mapperly.Abstractions;

namespace Api.Features.Rollcalls;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class RollcallMapper
{
  public partial Rollcall CreateToEntity(CreateRollcallRequest request);

  private partial RollcallEntry CreateEntryDtoToEntity(CreateRollcallEntryDto entryDto);

  public partial void UpdateEntityFromRequest(UpdateRollcallRequest request, Rollcall entity);

  private partial void UpdateEntryFromDto(UpdateRollcallEntryDto dto, RollcallEntry entity);

  [MapProperty("Group.Name", "GroupName")]
  public partial RollcallResponseDto EntityToResponseDto(Rollcall entity);

  [MapProperty("Member.FirstName", "MemberFirstName")]
  [MapProperty("Member.LastName", "MemberLastName")]
  private partial RollcallEntryResponseDto EntryToEntryResponseDto(RollcallEntry entry);

  public partial List<RollcallResponseDto> EntityToResponseDtoList(List<Rollcall> entities);

  public partial CreatedRollcallResponseDto EntityToCreatedResponseDto(Rollcall entity);

  [MapperIgnoreTarget(nameof(RollcallPreviewDto.TotalPresent))]
  [MapperIgnoreTarget(nameof(RollcallPreviewDto.TotalAbsent))]
  [MapperIgnoreTarget(nameof(RollcallPreviewDto.TotalLate))]
  public partial RollcallPreviewDto EntityToPreviewDto(Rollcall entity);

  public partial List<RollcallPreviewDto> EntityToPreviewDtoList(List<Rollcall> entities);
}