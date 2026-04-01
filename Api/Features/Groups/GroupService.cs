using System.Linq.Expressions;
using Api.Core.Repositories;
using Api.Core.Responses;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Groups;

public class GroupService(
  IGroupRepository _groupRepository,
  GroupMapper _mapper,
  GroupBusinessRules _businessRules,
  IUnitOfWork _unitOfWork) : IGroupService
{
  public async Task<ReturnModel<List<GroupResponseDto>>> GetAllAsync(
    Guid currentUserId,
    string userRole,
    Expression<Func<Group, bool>>? filter = null,
    Func<IQueryable<Group>, IQueryable<Group>>? include = null,
    Func<IQueryable<Group>, IOrderedQueryable<Group>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    IQueryable<Group> query = _groupRepository.Query(enableTracking, withDeleted);

    if (userRole != "Admin")
    {
      query = query.Where(x => x.CreatorId == currentUserId || x.Organization.OwnerId == currentUserId);
    }

    if (filter != null)
    {
      query = query.Where(filter);
    }

    query = include != null
      ? include(query)
      : query.Include(g => g.Organization).Include(g => g.Creator).Include(g => g.Members).Include(g => g.Rollcalls);

    if (orderBy != null)
    {
      query = orderBy(query);
    }

    List<Group> groups = await query.ToListAsync(cancellationToken);
    List<GroupResponseDto> response = _mapper.EntityToResponseDtoList(groups);

    return new ReturnModel<List<GroupResponseDto>>()
    {
      Success = true,
      Message = "Grup listesi başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<GroupResponseDto>> GetAsync(
    Expression<Func<Group, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Group>, IQueryable<Group>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Group? group = await _groupRepository.GetAsync(
      predicate,
      include: query => query.Include(g => g.Organization).Include(g => g.Creator).Include(g => g.Members).Include(g => g.Rollcalls),
      enableTracking,
      cancellationToken);

    if (group == null)
    {
      return new ReturnModel<GroupResponseDto>()
      {
        Success = true,
        Message = "Eşleşen grup bulunamadı.",
        Data = null,
        StatusCode = 200
      };
    }

    _businessRules.UserMustBeAuthorizedToManageGroup(group, currentUserId, userRole);

    GroupResponseDto response = _mapper.EntityToResponseDto(group);

    return new ReturnModel<GroupResponseDto>()
    {
      Success = true,
      Message = "Grup bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<GroupResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Group>, IQueryable<Group>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Group group = await _businessRules.GetGroupIfExistAsync(
      id,
      include: query => query.Include(g => g.Organization).Include(g => g.Creator).Include(g => g.Members).Include(g => g.Rollcalls),
      enableTracking,
      cancellationToken);

    _businessRules.UserMustBeAuthorizedToManageGroup(group, currentUserId, userRole);

    GroupResponseDto response = _mapper.EntityToResponseDto(group);

    return new ReturnModel<GroupResponseDto>()
    {
      Success = true,
      Message = $"{id} numaralı grup başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<CreatedGroupResponseDto>> AddAsync(
    CreateGroupRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    await _businessRules.UserMustOwnOrganizationToCreateGroup(request.OrganizationId, currentUserId, userRole);

    await _businessRules.GroupNameMustBeUniqueInOrganizationAsync(request.Name, request.OrganizationId, cancellationToken: cancellationToken);

    Group group = _mapper.CreateToEntity(request);
    group.CreatorId = currentUserId;

    await _groupRepository.AddAsync(group, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    CreatedGroupResponseDto response = _mapper.EntityToCreatedResponseDto(group);

    return new ReturnModel<CreatedGroupResponseDto>()
    {
      Success = true,
      Message = "Grup başarılı bir şekilde eklendi.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<NoData>> UpdateAsync(
    UpdateGroupRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    Group group = await _businessRules.GetGroupIfExistAsync(
      request.Id,
      include: q => q.Include(g => g.Organization),
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.UserMustBeAuthorizedToManageGroup(group, currentUserId, userRole);

    await _businessRules.GroupNameMustBeUniqueInOrganizationAsync(request.Name, group.OrganizationId, group.Id, cancellationToken);

    _mapper.UpdateEntityFromRequest(request, group);

    _groupRepository.Update(group);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Grup başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    Group group = await _businessRules.GetGroupIfExistAsync(
      id,
      include: q => q.Include(g => g.Organization),
      enableTracking: true,
      cancellationToken: cancellationToken);

    _businessRules.UserMustBeAuthorizedToManageGroup(group, currentUserId, userRole);

    _groupRepository.Delete(group);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Grup başarılı bir şekilde silindi.",
      StatusCode = 200
    };
  }
}