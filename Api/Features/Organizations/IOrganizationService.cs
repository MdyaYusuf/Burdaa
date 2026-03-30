using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.Organizations;

public interface IOrganizationService
{
  Task<ReturnModel<List<OrganizationResponseDto>>> GetAllAsync(
    Guid currentUserId,
    string userRole,
    Expression<Func<Organization, bool>>? filter = null,
    Func<IQueryable<Organization>, IQueryable<Organization>>? include = null,
    Func<IQueryable<Organization>, IOrderedQueryable<Organization>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<OrganizationResponseDto>> GetAsync(
    Expression<Func<Organization, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Organization>, IQueryable<Organization>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<OrganizationResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Organization>, IQueryable<Organization>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedOrganizationResponseDto>> AddAsync(
    CreateOrganizationRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateOrganizationRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);
}