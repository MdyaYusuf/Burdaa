using System.Linq.Expressions;
using Api.Core.Repositories;
using Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Rollcalls;

public class EfRollcallRepository : EfBaseRepository<BaseDbContext, Rollcall, Guid>, IRollcallRepository
{
  public EfRollcallRepository(BaseDbContext context) : base(context)
  {

  }

  public async Task<List<Rollcall>> GetRecentByOrganizationAsync(
    Guid organizationId,
    int count,
    Expression<Func<Rollcall, bool>>? filter = null,
    Func<IQueryable<Rollcall>, IQueryable<Rollcall>>? include = null,
    Func<IQueryable<Rollcall>, IOrderedQueryable<Rollcall>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    IQueryable<Rollcall> query = _context.Set<Rollcall>();

    if (!enableTracking)
    {
      query = query.AsNoTracking();
    }

    if (withDeleted)
    {
      query = query.IgnoreQueryFilters();
    }

    if (include != null)
    {
      query = include(query);
    }

    if (filter != null)
    {
      query = query.Where(filter);
    }

    if (orderBy != null)
    {
      query = orderBy(query);
    }

    return await query
      .Where(r => r.Group.OrganizationId == organizationId)
      .Take(count)
      .ToListAsync(cancellationToken);
  }
}