using Riok.Mapperly.Abstractions;

namespace Api.Features.Organizations;

[Mapper(RequiredMappingStrategy = RequiredMappingStrategy.None)]
public partial class OrganizationMapper
{
  [MapperIgnoreSource(nameof(CreateOrganizationRequest.LogoFile))]
  public partial Organization CreateToEntity(CreateOrganizationRequest request);
  [MapperIgnoreSource(nameof(UpdateOrganizationRequest.LogoFile))]
  public partial void UpdateEntityFromRequest(UpdateOrganizationRequest request, Organization entity);
  [MapProperty("Owner.Username", "OwnerName")]
  [MapProperty("Groups.Count", "TotalGroups")]
  public partial OrganizationResponseDto EntityToResponseDto(Organization entity);
  public partial List<OrganizationResponseDto> EntityToResponseDtoList(List<Organization> entities);
  public partial CreatedOrganizationResponseDto EntityToCreatedResponseDto(Organization entity);
  [MapProperty("Groups.Count", "GroupCount")]
  public partial OrganizationPreviewDto EntityToPreviewDto(Organization entity);
}