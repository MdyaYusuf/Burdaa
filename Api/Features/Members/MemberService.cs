using System.Linq.Expressions;
using Api.Core.Helpers;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Features.Rollcalls;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Members;

public class MemberService(
  IMemberRepository _memberRepository,
  MemberMapper _mapper,
  MemberBusinessRules _businessRules,
  IUnitOfWork _unitOfWork,
  IValidator<CreateMemberRequest> _createValidator,
  IValidator<UpdateMemberRequest> _updateValidator) : IMemberService
{
  public async Task<ReturnModel<List<MemberResponseDto>>> GetAllAsync(
    Guid currentUserId,
    string userRole,
    Expression<Func<Member, bool>>? filter = null,
    Func<IQueryable<Member>, IQueryable<Member>>? include = null,
    Func<IQueryable<Member>, IOrderedQueryable<Member>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    var members = await _memberRepository.GetAllAsync(
      filter: userRole == "Admin"
        ? filter
        : x => x.Group.CreatorId == currentUserId || x.Group.Organization.OwnerId == currentUserId,
      include: include ?? (q => q.Include(m => m.Group)),
      orderBy: orderBy,
      enableTracking: enableTracking,
      withDeleted: withDeleted,
      cancellationToken: cancellationToken);

    List<MemberResponseDto> response = _mapper.EntityToResponseDtoList(members);

    return new ReturnModel<List<MemberResponseDto>>()
    {
      Success = true,
      Message = "Üye listesi başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<MemberResponseDto>> GetAsync(
    Expression<Func<Member, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Member>, IQueryable<Member>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Member? member = await _memberRepository.GetAsync(
      predicate,
      include: query => query.Include(m => m.Group).ThenInclude(g => g.Organization),
      enableTracking,
      cancellationToken);

    if (member == null)
    {
      return new ReturnModel<MemberResponseDto>()
      {
        Success = true,
        Message = "Eşleşen üye bulunamadı.",
        Data = null,
        StatusCode = 200
      };
    }

    await _businessRules.UserMustHavePermissionToManageMember(member.GroupId, currentUserId, userRole);

    MemberResponseDto response = _mapper.EntityToResponseDto(member);

    return new ReturnModel<MemberResponseDto>()
    {
      Success = true,
      Message = "Üye bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<MemberResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Member>, IQueryable<Member>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Member member = await _businessRules.GetMemberIfExistAsync(
      id,
      include: query => query.Include(m => m.Group).ThenInclude(g => g.Organization),
      enableTracking,
      cancellationToken);

    await _businessRules.UserMustHavePermissionToManageMember(member.GroupId, currentUserId, userRole);

    MemberResponseDto response = _mapper.EntityToResponseDto(member);

    return new ReturnModel<MemberResponseDto>()
    {
      Success = true,
      Message = $"{id} numaralı üye başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<CreatedMemberResponseDto>> AddAsync(
    CreateMemberRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _createValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    await _businessRules.UserMustHavePermissionToManageMember(request.GroupId, currentUserId, userRole);
    await _businessRules.MemberExternalIdMustBeUniqueInGroupAsync(request.ExternalId, request.GroupId, cancellationToken: cancellationToken);

    Member member = _mapper.CreateToEntity(request);

    if (request.ProfileImage != null)
    {
      member.ProfileImageUrl = await FileHelper.SaveImageToDisk(
        request.ProfileImage,
        "members",
        $"{member.FirstName}-{member.LastName}",
        cancellationToken);
    }

    await _memberRepository.AddAsync(member, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    CreatedMemberResponseDto response = _mapper.EntityToCreatedResponseDto(member);

    return new ReturnModel<CreatedMemberResponseDto>()
    {
      Success = true,
      Message = "Üye başarılı bir şekilde eklendi.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<NoData>> UpdateAsync(
    UpdateMemberRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _updateValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    Member member = await _businessRules.GetMemberIfExistAsync(request.Id, enableTracking: true, cancellationToken: cancellationToken);

    await _businessRules.UserMustHavePermissionToManageMember(member.GroupId, currentUserId, userRole);
    await _businessRules.MemberExternalIdMustBeUniqueInGroupAsync(request.ExternalId, member.GroupId, member.Id, cancellationToken);

    member.ProfileImageUrl = await FileHelper.ReplaceImageOnDisk(
      request.ProfileImage,
      member.ProfileImageUrl,
      "members",
      $"{request.FirstName}-{request.LastName}",
      cancellationToken);

    _mapper.UpdateEntityFromRequest(request, member);

    _memberRepository.Update(member);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Üye başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    Member member = await _businessRules.GetMemberIfExistAsync(id, enableTracking: true, cancellationToken: cancellationToken);

    await _businessRules.UserMustHavePermissionToManageMember(member.GroupId, currentUserId, userRole);

    _memberRepository.Delete(member);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Üye başarılı bir şekilde silindi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<MemberStatsResponseDto>> GetStatsByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    var member = await _businessRules.GetMemberIfExistAsync(
      id,
      include: q => q.Include(m => m.Group),
      enableTracking: false,
      cancellationToken: cancellationToken);

    await _businessRules.UserMustHavePermissionToManageMember(
      member.GroupId,
      currentUserId,
      userRole);

    var stats = await _memberRepository.Query(enableTracking: false)
      .Where(m => m.Id == id)
      .Select(m => new
      {
        Total = m.RollcallEntries.Count(),
        Present = m.RollcallEntries.Count(e => e.Status == AttendanceStatus.Present),
        Late = m.RollcallEntries.Count(e => e.Status == AttendanceStatus.Late),
        Absent = m.RollcallEntries.Count(e => e.Status == AttendanceStatus.Absent),
        LastSeenDate = m.RollcallEntries
          .OrderByDescending(e => e.CreatedDate)
          .Select(e => (DateTime?)e.CreatedDate)
          .FirstOrDefault()
      })
      .FirstOrDefaultAsync(cancellationToken);

    if (stats == null)
    {
      return new ReturnModel<MemberStatsResponseDto>
      {
        Success = false,
        Message = "İstatistik verilerine ulaşılamadı.",
        StatusCode = 500
      };
    }

    double attendanceRate = stats.Total == 0 ? 0 : Math.Round((double)stats.Present / stats.Total * 100, 1);

    MemberStatsResponseDto response = new(
      TotalSessions: stats.Total,
      AttendanceRate: attendanceRate,
      PresentCount: stats.Present,
      LateCount: stats.Late,
      AbsentCount: stats.Absent,
      LastSeen: stats.LastSeenDate);

    return new ReturnModel<MemberStatsResponseDto>
    {
      Success = true,
      Data = response,
      Message = "Üye istatistikleri başarıyla hesaplandı.",
      StatusCode = 200
    };
  }
}