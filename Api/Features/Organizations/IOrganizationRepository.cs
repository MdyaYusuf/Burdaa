using Api.Core.Repositories;

namespace Api.Features.Organizations;

public interface IOrganizationRepository : IRepository<Organization, Guid>
{

}