using Api.Core.Exceptions;
using Api.Features.Groups;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Members;

public class MemberBusinessRules(
  IMemberRepository _memberRepository,
  IGroupRepository _groupRepository)
{
  public async Task<Member> GetMemberIfExistAsync(
    Guid id,
    Func<IQueryable<Member>, IQueryable<Member>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    var member = await _memberRepository.GetByIdAsync(id, include, enableTracking, cancellationToken);

    if (member == null)
    {
      throw new NotFoundException($"{id} numaralı üye bulunamadı.");
    }

    return member;
  }

  public async Task MemberIdMustExist(Guid memberId, CancellationToken cancellationToken)
  {
    bool exists = await _memberRepository.AnyAsync(m => m.Id == memberId, cancellationToken);

    if (!exists)
    {
      throw new NotFoundException($"{memberId} numaralı üye bulunamadı.");
    }
  }

  public async Task MemberExternalIdMustBeUniqueInGroupAsync(
    string? externalId,
    Guid groupId,
    Guid? memberId = null,
    CancellationToken cancellationToken = default)
  {
    if (string.IsNullOrWhiteSpace(externalId))
    {
      return;
    }

    var exists = await _memberRepository.AnyAsync(
      m => m.ExternalId == externalId &&
      m.GroupId == groupId &&
      (memberId == null || m.Id != memberId), cancellationToken);

    if (exists)
    {
      throw new BusinessException($"Bu grupta {externalId} ID'li bir üye zaten mevcut.");
    }
  }

  public async Task UserMustHavePermissionToManageMember(Guid groupId, Guid currentUserId, string userRole)
  {
    if (userRole == "Admin")
    {
      return;
    }

    var group = await _groupRepository.GetByIdAsync(
      groupId,
      include: q => q.Include(g => g.Organization));

    if (group == null)
    {
      throw new NotFoundException("Üyenin bağlı olduğu grup bulunamadı.");
    }

    bool isGroupCreator = group.CreatorId == currentUserId;
    bool isOrgOwner = group.Organization?.OwnerId == currentUserId;

    if (!isGroupCreator && !isOrgOwner)
    {
      throw new ForbiddenException("Bu üye üzerinde işlem yapmak için yetkiniz bulunmamaktadır.");
    }
  }

  public void MemberMustBelongToGroup(Member member, Guid groupId)
  {
    if (member.GroupId != groupId)
    {
      throw new BusinessException("Üye belirtilen gruba ait değil.");
    }
  }
}