using System.Linq.Expressions;
using Api.Core.Helpers;
using Api.Core.Repositories;
using Api.Core.Responses;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Organizations;

public class OrganizationService(
  IOrganizationRepository _organizationRepository,
  OrganizationMapper _mapper,
  OrganizationBusinessRules _businessRules,
  IUnitOfWork _unitOfWork,
  IValidator<CreateOrganizationRequest> _createValidator,
  IValidator<UpdateOrganizationRequest> _updateValidator) : IOrganizationService
{
  public async Task<ReturnModel<List<OrganizationResponseDto>>> GetAllAsync(
    Guid currentUserId,
    string userRole,
    Expression<Func<Organization, bool>>? filter = null,
    Func<IQueryable<Organization>, IQueryable<Organization>>? include = null,
    Func<IQueryable<Organization>, IOrderedQueryable<Organization>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    IQueryable<Organization> query = _organizationRepository.Query(enableTracking, withDeleted);

    if (userRole != "Admin")
    {
      query = query.Where(x => x.OwnerId == currentUserId);
    }

    if (filter != null)
    {
      query = query.Where(filter);
    }

    query = include != null
      ? include(query)
      : query.Include(o => o.Owner).Include(o => o.Groups);

    if (orderBy != null)
    {
      query = orderBy(query);
    }

    List<Organization> organizations = await query.ToListAsync(cancellationToken);
    List<OrganizationResponseDto> response = _mapper.EntityToResponseDtoList(organizations);

    return new ReturnModel<List<OrganizationResponseDto>>()
    {
      Success = true,
      Message = "Organizasyon listesi başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<OrganizationResponseDto>> GetAsync(
    Expression<Func<Organization, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Organization>, IQueryable<Organization>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Organization? organization = await _organizationRepository.GetAsync(
      predicate,
      include: query => query.Include(o => o.Owner).Include(o => o.Groups),
      enableTracking,
      cancellationToken);

    if (organization == null)
    {
      return new ReturnModel<OrganizationResponseDto>()
      {
        Success = true,
        Message = "Eşleşen organizasyon bulunamadı.",
        Data = null,
        StatusCode = 200
      };
    }

    _businessRules.UserMustBeOwnerOrAdmin(organization, currentUserId, userRole);

    OrganizationResponseDto response = _mapper.EntityToResponseDto(organization);

    return new ReturnModel<OrganizationResponseDto>()
    {
      Success = true,
      Message = "Organizasyon başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<OrganizationResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Organization>, IQueryable<Organization>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Organization organization = await _businessRules.GetOrganizationIfExistAsync(
      id,
      include: query => query.Include(o => o.Owner).Include(o => o.Groups),
      enableTracking,
      cancellationToken);

    _businessRules.UserMustBeOwnerOrAdmin(organization, currentUserId, userRole);

    OrganizationResponseDto response = _mapper.EntityToResponseDto(organization);

    return new ReturnModel<OrganizationResponseDto>()
    {
      Success = true,
      Message = $"{id} numaralı organizasyon başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<CreatedOrganizationResponseDto>> AddAsync(
    CreateOrganizationRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _createValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    await _businessRules.OrganizationNameMustBeUniqueForUserAsync(request.Name, currentUserId, cancellationToken: cancellationToken);

    Organization organization = _mapper.CreateToEntity(request);
    organization.OwnerId = currentUserId;

    if (request.LogoFile != null)
    {
      organization.LogoUrl = await FileHelper.SaveImageToDisk(
        request.LogoFile,
        "logos",
        request.Name,
        cancellationToken);
    }

    await _organizationRepository.AddAsync(organization, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    CreatedOrganizationResponseDto response = _mapper.EntityToCreatedResponseDto(organization);

    return new ReturnModel<CreatedOrganizationResponseDto>()
    {
      Success = true,
      Message = "Organizasyon başarılı bir şekilde eklendi.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<NoData>> UpdateAsync(
    UpdateOrganizationRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _updateValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    Organization organization = await _businessRules.GetOrganizationIfExistAsync(request.Id, enableTracking: true, cancellationToken: cancellationToken);

    _businessRules.UserMustBeOwnerOrAdmin(organization, currentUserId, userRole);
    await _businessRules.OrganizationNameMustBeUniqueForUserAsync(request.Name, organization.OwnerId, organization.Id, cancellationToken);

    organization.LogoUrl = await FileHelper.ReplaceImageOnDisk(
      request.LogoFile,
      organization.LogoUrl,
      "logos",
      request.Name,
      cancellationToken);

    _mapper.UpdateEntityFromRequest(request, organization);

    _organizationRepository.Update(organization);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Organizasyon başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    Organization organization = await _businessRules.GetOrganizationIfExistAsync(id, enableTracking: true, cancellationToken: cancellationToken);

    _businessRules.UserMustBeOwnerOrAdmin(organization, currentUserId, userRole);
    await _businessRules.OrganizationMustHaveNoActiveGroupsBeforeDelete(id, cancellationToken);

    _organizationRepository.Delete(organization);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Organizasyon başarılı bir şekilde silindi.",
      StatusCode = 200
    };
  }
}