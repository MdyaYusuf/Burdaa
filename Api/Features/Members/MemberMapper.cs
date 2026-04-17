using Riok.Mapperly.Abstractions;

namespace Api.Features.Members;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class MemberMapper
{
  [MapperIgnoreSource(nameof(CreateMemberRequest.ProfileImage))]
  public partial Member CreateToEntity(CreateMemberRequest request);
  public partial void UpdateEntityFromRequest(UpdateMemberRequest request, Member entity);
  public partial MemberResponseDto EntityToResponseDto(Member entity);
  public partial List<MemberResponseDto> EntityToResponseDtoList(List<Member> entities);
  public partial CreatedMemberResponseDto EntityToCreatedResponseDto(Member entity);
  public partial MemberPreviewDto EntityToPreviewDto(Member entity);
  public partial List<MemberPreviewDto> EntityToPreviewDtoList(List<Member> entities);
}