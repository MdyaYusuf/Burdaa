using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.Groups;

public interface IGroupService
{
  Task<ReturnModel<List<GroupResponseDto>>> GetAllAsync(
    Expression<Func<Group, bool>>? filter = null,
    Func<IQueryable<Group>, IQueryable<Group>>? include = null,
    Func<IQueryable<Group>, IOrderedQueryable<Group>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<GroupResponseDto>> GetAsync(
    Expression<Func<Group, bool>> predicate,
    Func<IQueryable<Group>, IQueryable<Group>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<GroupResponseDto>> GetByIdAsync(
    Guid id,
    Func<IQueryable<Group>, IQueryable<Group>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedGroupResponseDto>> AddAsync(
    CreateGroupRequest request,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateGroupRequest request,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    CancellationToken cancellationToken = default);
}