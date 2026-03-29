using Api.Core.Repositories;

namespace Api.Features.Members;

public interface IMemberRepository : IRepository<Member, Guid>
{

}