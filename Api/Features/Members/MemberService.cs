using System.Linq.Expressions;
using Api.Core.Repositories;
using Api.Core.Responses;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Members;

public class MemberService(
    IMemberRepository _memberRepository,
    MemberMapper _mapper,
    MemberBusinessRules _businessRules,
    IUnitOfWork _unitOfWork) : IMemberService
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
    IQueryable<Member> query = _memberRepository.Query(enableTracking, withDeleted);

    if (userRole != "Admin")
    {
      query = query.Where(x => x.Group.CreatorId == currentUserId || x.Group.Organization.OwnerId == currentUserId);
    }

    if (filter != null)
    {
      query = query.Where(filter);
    }

    query = include != null
      ? include(query)
      : query.Include(m => m.Group);

    if (orderBy != null)
    {
      query = orderBy(query);
    }

    List<Member> members = await query.ToListAsync(cancellationToken);
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
    await _businessRules.UserMustHavePermissionToManageMember(request.GroupId, currentUserId, userRole);

    await _businessRules.MemberExternalIdMustBeUniqueInGroupAsync(request.ExternalId, request.GroupId, cancellationToken: cancellationToken);

    Member member = _mapper.CreateToEntity(request);

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
    Member member = await _businessRules.GetMemberIfExistAsync(request.Id, enableTracking: true, cancellationToken: cancellationToken);

    await _businessRules.UserMustHavePermissionToManageMember(member.GroupId, currentUserId, userRole);

    await _businessRules.MemberExternalIdMustBeUniqueInGroupAsync(request.ExternalId, member.GroupId, member.Id, cancellationToken);

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
}