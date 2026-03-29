using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.Rollcalls;

public class EfRollcallRepository : EfBaseRepository<BaseDbContext, Rollcall, Guid>, IRollcallRepository
{
  public EfRollcallRepository(BaseDbContext context) : base(context)
  {

  }
}