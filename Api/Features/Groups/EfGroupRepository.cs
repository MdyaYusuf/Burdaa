using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.Groups;

public class EfGroupRepository : EfBaseRepository<BaseDbContext, Group, Guid>, IGroupRepository
{
  public EfGroupRepository(BaseDbContext context) : base(context)
  {

  }
}