using Api.Core.Exceptions;
using Api.Features.Groups;
using Api.Features.Members;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Rollcalls;

public class RollcallBusinessRules(
  IRollcallRepository _rollcallRepository,
  IGroupRepository _groupRepository,
  IMemberRepository _memberRepository)
{
  public async Task<Rollcall> GetRollcallIfExistAsync(
    Guid id,
    Func<IQueryable<Rollcall>, IQueryable<Rollcall>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    var rollcall = await _rollcallRepository.GetByIdAsync(id, include, enableTracking, cancellationToken);

    if (rollcall == null)
    {
      throw new NotFoundException($"{id} numaralı yoklama kaydı bulunamadı.");
    }

    return rollcall;
  }

  public async Task UserMustHavePermissionToManageRollcall(Guid groupId, Guid currentUserId, string userRole)
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
      throw new NotFoundException("Yoklamanın bağlı olduğu grup bulunamadı.");
    }

    bool isGroupCreator = group.CreatorId == currentUserId;
    bool isOrgOwner = group.Organization?.OwnerId == currentUserId;

    if (!isGroupCreator && !isOrgOwner)
    {
      throw new ForbiddenException("Bu grup için yoklama yönetme yetkiniz bulunmamaktadır.");
    }
  }

  public async Task AllMembersMustBelongToGroupAsync(Guid groupId, List<Guid> memberIds, CancellationToken cancellationToken)
  {
    var validMemberCount = await _memberRepository.AnyAsync(
      m => memberIds.Contains(m.Id) && m.GroupId != groupId,
      cancellationToken);

    if (validMemberCount)
    {
      throw new BusinessException("Seçilen üyelerden biri veya daha fazlası bu gruba ait değil.");
    }
  }

  public void RollcallDateCannotBeInFuture(DateTime date)
  {
    if (date > DateTime.UtcNow.AddDays(1))
    {
      throw new BusinessException("Gelecek bir tarih için yoklama girişi yapılamaz.");
    }
  }

  public async Task RollcallTitleMustBeUniqueForGroupOnDateAsync(
    string title,
    Guid groupId,
    DateTime date,
    Guid? rollcallId = null,
    CancellationToken cancellationToken = default)
  {
    var exists = await _rollcallRepository.AnyAsync(
      r => r.Title == title &&
      r.GroupId == groupId &&
      r.Date.Date == date.Date &&
      (rollcallId == null || r.Id != rollcallId), cancellationToken);

    if (exists)
    {
      throw new BusinessException("Bu grup için bu tarihte aynı başlıkla bir yoklama zaten mevcut.");
    }
  }
}