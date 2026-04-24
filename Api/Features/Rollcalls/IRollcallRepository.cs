using System.Linq.Expressions;
using Api.Core.Repositories;

namespace Api.Features.Rollcalls;

public interface IRollcallRepository : IRepository<Rollcall, Guid>
{
  Task<List<Rollcall>> GetRecentByOrganizationAsync(
    Guid organizationId,
    int count,
    Expression<Func<Rollcall, bool>>? filter = null,
    Func<IQueryable<Rollcall>, IQueryable<Rollcall>>? include = null,
    Func<IQueryable<Rollcall>, IOrderedQueryable<Rollcall>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);
}