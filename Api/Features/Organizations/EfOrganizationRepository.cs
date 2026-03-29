using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.Organizations;

public class EfOrganizationRepository : EfBaseRepository<BaseDbContext, Organization, Guid>, IOrganizationRepository
{
  public EfOrganizationRepository(BaseDbContext context) : base(context)
  {

  }
}