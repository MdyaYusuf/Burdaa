using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.Users;

public interface IUserService
{
  Task<ReturnModel<List<UserResponseDto>>> GetAllAsync(
    Expression<Func<User, bool>>? filter = null,
    Func<IQueryable<User>, IQueryable<User>>? include = null,
    Func<IQueryable<User>, IOrderedQueryable<User>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<UserResponseDto>> GetAsync(
    Expression<Func<User, bool>> predicate,
    Func<IQueryable<User>, IQueryable<User>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<UserResponseDto>> GetByIdAsync(
    Guid id,
    Func<IQueryable<User>, IQueryable<User>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateUserRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> ChangePasswordAsync(
    ChangePasswordRequest request,
    Guid userId,
    CancellationToken cancellationToken = default);
}