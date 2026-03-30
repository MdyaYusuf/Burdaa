using Api.Core.Exceptions;

namespace Api.Features.Organizations;

public class OrganizationBusinessRules(IOrganizationRepository _organizationRepository)
{
  public async Task<Organization> GetOrganizationIfExistAsync(
    Guid id,
    Func<IQueryable<Organization>, IQueryable<Organization>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    var organization = await _organizationRepository.GetByIdAsync(id, include, enableTracking, cancellationToken);

    if (organization == null)
    {
      throw new NotFoundException($"{id} numaralı organizasyon bulunamadı.");
    }

    return organization;
  }

  public async Task OrganizationIdMustExist(Guid organizationId, CancellationToken cancellationToken)
  {
    bool exists = await _organizationRepository.AnyAsync(o => o.Id == organizationId, cancellationToken);

    if (!exists)
    {
      throw new NotFoundException($"{organizationId} numaralı organizasyon bulunamadı.");
    }
  }

  public async Task OrganizationNameMustBeUniqueForUserAsync(
    string name,
    Guid ownerId,
    Guid? organizationId = null,
    CancellationToken cancellationToken = default)
  {
    var exists = await _organizationRepository.AnyAsync(
      o => o.Name == name &&
      o.OwnerId == ownerId &&
      (organizationId == null || o.Id != organizationId), cancellationToken);

    if (exists)
    {
      throw new BusinessException("Bu isimle zaten bir organizasyonunuz bulunmaktadır.");
    }
  }

  public void UserMustBeOwnerOrAdmin(Organization organization, Guid currentUserId, string userRole)
  {
    if (organization.OwnerId != currentUserId && userRole != "Admin")
    {
      throw new ForbiddenException("Bu organizasyon üzerinde işlem yapma yetkiniz bulunmamaktadır.");
    }
  }

  public async Task OrganizationMustHaveNoActiveGroupsBeforeDelete(Guid organizationId, CancellationToken cancellationToken)
  {
    var organization = await _organizationRepository.GetByIdAsync(
      organizationId,
      include: q => Microsoft.EntityFrameworkCore.EntityFrameworkQueryableExtensions.Include(q, o => o.Groups));

    if (organization?.Groups.Any() == true)
    {
      throw new BusinessException("İçinde aktif gruplar bulunan bir organizasyonu silemezsiniz. Önce grupları siliniz.");
    }
  }
}