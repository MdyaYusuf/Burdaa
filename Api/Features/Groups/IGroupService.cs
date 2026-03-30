using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.Groups;

public interface IGroupService
{
  Task<ReturnModel<List<GroupResponseDto>>> GetAllAsync(
    Guid currentUserId,
    string userRole,
    Expression<Func<Group, bool>>? filter = null,
    Func<IQueryable<Group>, IQueryable<Group>>? include = null,
    Func<IQueryable<Group>, IOrderedQueryable<Group>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<GroupResponseDto>> GetAsync(
    Expression<Func<Group, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Group>, IQueryable<Group>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<GroupResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Group>, IQueryable<Group>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedGroupResponseDto>> AddAsync(
    CreateGroupRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateGroupRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);
}