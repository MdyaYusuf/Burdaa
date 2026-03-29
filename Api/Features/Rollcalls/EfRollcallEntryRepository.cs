using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.Rollcalls;

public class EfRollcallEntryRepository : EfBaseRepository<BaseDbContext, RollcallEntry, Guid>, IRollcallEntryRepository
{
  public EfRollcallEntryRepository(BaseDbContext context) : base(context)
  {

  }
}