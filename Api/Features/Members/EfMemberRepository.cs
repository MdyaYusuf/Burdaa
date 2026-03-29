using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.Members;

public class EfMemberRepository : EfBaseRepository<BaseDbContext, Member, Guid>, IMemberRepository
{
  public EfMemberRepository(BaseDbContext context) : base(context)
  {

  }
}