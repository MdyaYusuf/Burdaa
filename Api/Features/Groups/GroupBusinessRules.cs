using Api.Core.Exceptions;
using Api.Features.Organizations;

namespace Api.Features.Groups;

public class GroupBusinessRules(
  IGroupRepository _groupRepository,
  IOrganizationRepository _organizationRepository)
{
  public async Task<Group> GetGroupIfExistAsync(
    Guid id,
    Func<IQueryable<Group>, IQueryable<Group>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    var group = await _groupRepository.GetByIdAsync(id, include, enableTracking, cancellationToken);

    if (group == null)
    {
      throw new NotFoundException($"{id} numaralı grup bulunamadı.");
    }

    return group;
  }

  public async Task GroupIdMustExist(Guid groupId, CancellationToken cancellationToken)
  {
    bool exists = await _groupRepository.AnyAsync(g => g.Id == groupId, cancellationToken);

    if (!exists)
    {
      throw new NotFoundException($"{groupId} numaralı grup bulunamadı.");
    }
  }

  public async Task GroupNameMustBeUniqueInOrganizationAsync(
    string name,
    Guid organizationId,
    Guid? id = null,
    CancellationToken cancellationToken = default)
  {
    var exists = await _groupRepository.AnyAsync(
      g => g.Name == name &&
      g.OrganizationId == organizationId &&
      (id == null || g.Id != id), cancellationToken);

    if (exists)
    {
      throw new BusinessException("Bu organizasyon altında bu isimle zaten bir grup bulunmaktadır.");
    }
  }

  public void UserMustBeAuthorizedToManageGroup(Group group, Guid currentUserId, string userRole)
  {
    if (userRole == "Admin")
    {
      return;
    }

    bool isCreator = group.CreatorId == currentUserId;

    bool isOrgOwner = group.Organization?.OwnerId == currentUserId;

    if (!isCreator && !isOrgOwner)
    {
      throw new ForbiddenException("Bu grubu yönetmek için yetkiniz bulunmamaktadır.");
    }
  }

  public async Task UserMustOwnOrganizationToCreateGroup(Guid organizationId, Guid currentUserId, string userRole)
  {
    if (userRole == "Admin")
    {
      return;
    }

    var organization = await _organizationRepository.GetByIdAsync(organizationId);

    if (organization == null)
    {
      throw new NotFoundException("Organizasyon bulunamadı.");
    }

    if (organization.OwnerId != currentUserId)
    {
      throw new ForbiddenException("Sadece kendi organizasyonlarınız altında grup oluşturabilirsiniz.");
    }
  }
}