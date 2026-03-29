using Api.Core.Repositories;

namespace Api.Features.Rollcalls;

public interface IRollcallEntryRepository : IRepository<RollcallEntry, Guid>
{

}