using Api.Core.Repositories;

namespace Api.Features.Rollcalls;

public interface IRollcallRepository : IRepository<Rollcall, Guid>
{

}