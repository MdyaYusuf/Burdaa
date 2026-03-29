using Riok.Mapperly.Abstractions;

namespace Api.Features.Groups;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class GroupMapper
{
  public partial Group CreateToEntity(CreateGroupRequest request);
  public partial void UpdateEntityFromRequest(UpdateGroupRequest request, Group entity);
  [MapProperty("Organization.Name", "OrganizationName")]
  [MapProperty("Creator.Username", "CreatorName")]
  [MapProperty("Members.Count", "TotalMembers")]
  [MapProperty("Rollcalls.Count", "TotalRollcalls")]
  public partial GroupResponseDto EntityToResponseDto(Group entity);
  public partial List<GroupResponseDto> EntityToResponseDtoList(List<Group> entities);
  public partial CreatedGroupResponseDto EntityToCreatedResponseDto(Group entity);
  [MapProperty("Members.Count", "MemberCount")]
  public partial GroupPreviewDto EntityToPreviewDto(Group entity);
  public partial List<GroupPreviewDto> EntityToPreviewDtoList(List<Group> entities);
}