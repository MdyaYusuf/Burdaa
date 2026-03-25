using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.Roles;

public interface IRoleService
{
  Task<ReturnModel<List<RoleResponseDto>>> GetAllAsync(
    Expression<Func<Role, bool>>? filter = null,
    Func<IQueryable<Role>, IQueryable<Role>>? include = null,
    Func<IQueryable<Role>, IOrderedQueryable<Role>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<RoleResponseDto>> GetAsync(
    Expression<Func<Role, bool>> predicate,
    Func<IQueryable<Role>, IQueryable<Role>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<RoleResponseDto>> GetByIdAsync(
    int id,
    Func<IQueryable<Role>, IQueryable<Role>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<RoleResponseDto>> AddAsync(
    CreateRoleRequest request,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    int id,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateRoleRequest request,
    CancellationToken cancellationToken = default);
}