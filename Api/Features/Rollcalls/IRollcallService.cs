using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.Rollcalls;

public interface IRollcallService
{
  Task<ReturnModel<List<RollcallResponseDto>>> GetAllAsync(
    Guid currentUserId,
    string userRole,
    Expression<Func<Rollcall, bool>>? filter = null,
    Func<IQueryable<Rollcall>, IQueryable<Rollcall>>? include = null,
    Func<IQueryable<Rollcall>, IOrderedQueryable<Rollcall>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<RollcallResponseDto>> GetAsync(
    Expression<Func<Rollcall, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Rollcall>, IQueryable<Rollcall>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<RollcallResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Rollcall>, IQueryable<Rollcall>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedRollcallResponseDto>> AddAsync(
    CreateRollcallRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateRollcallRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);
}