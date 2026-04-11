using System.Linq.Expressions;
using Api.Core.Repositories;
using Api.Core.Responses;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Rollcalls;

public class RollcallService(
  IRollcallRepository _rollcallRepository,
  RollcallMapper _mapper,
  RollcallBusinessRules _businessRules,
  IUnitOfWork _unitOfWork,
  IValidator<CreateRollcallRequest> _createValidator,
  IValidator<UpdateRollcallRequest> _updateValidator) : IRollcallService
{
  public async Task<ReturnModel<List<RollcallResponseDto>>> GetAllAsync(
    Guid currentUserId,
    string userRole,
    Expression<Func<Rollcall, bool>>? filter = null,
    Func<IQueryable<Rollcall>, IQueryable<Rollcall>>? include = null,
    Func<IQueryable<Rollcall>, IOrderedQueryable<Rollcall>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    var rollcalls = await _rollcallRepository.GetAllAsync(
      filter: userRole == "Admin" ? filter : x => x.Group.CreatorId == currentUserId || x.Group.Organization.OwnerId == currentUserId,
      include: include ?? (q => q.Include(x => x.Group).Include(x => x.Entries).ThenInclude(e => e.Member)),
      orderBy: orderBy,
      enableTracking: enableTracking,
      withDeleted: withDeleted,
      cancellationToken: cancellationToken);

    List<RollcallResponseDto> response = _mapper.EntityToResponseDtoList(rollcalls);

    return new ReturnModel<List<RollcallResponseDto>>()
    {
      Success = true,
      Message = "Yoklama listesi başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<RollcallResponseDto>> GetAsync(
    Expression<Func<Rollcall, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Rollcall>, IQueryable<Rollcall>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Rollcall? rollcall = await _rollcallRepository.GetAsync(
      predicate,
      include: q => q.Include(r => r.Group).ThenInclude(g => g.Organization).Include(r => r.Entries).ThenInclude(e => e.Member),
      enableTracking,
      cancellationToken);

    if (rollcall == null)
    {
      return new ReturnModel<RollcallResponseDto>()
      {
        Success = true,
        Message = "Eşleşen yoklama kaydı bulunamadı.",
        Data = null,
        StatusCode = 200
      };
    }

    await _businessRules.UserMustHavePermissionToManageRollcall(rollcall.GroupId, currentUserId, userRole);

    RollcallResponseDto response = _mapper.EntityToResponseDto(rollcall);

    return new ReturnModel<RollcallResponseDto>()
    {
      Success = true,
      Message = "Yoklama bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<RollcallResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Rollcall>, IQueryable<Rollcall>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    Rollcall rollcall = await _businessRules.GetRollcallIfExistAsync(
      id,
      include: q => q.Include(r => r.Group).ThenInclude(g => g.Organization).Include(r => r.Entries).ThenInclude(e => e.Member),
      enableTracking,
      cancellationToken);

    await _businessRules.UserMustHavePermissionToManageRollcall(rollcall.GroupId, currentUserId, userRole);

    RollcallResponseDto response = _mapper.EntityToResponseDto(rollcall);

    return new ReturnModel<RollcallResponseDto>()
    {
      Success = true,
      Message = $"{rollcall.Title} başlıklı yoklama başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<CreatedRollcallResponseDto>> AddAsync(
    CreateRollcallRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _createValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    await _businessRules.UserMustHavePermissionToManageRollcall(request.GroupId, currentUserId, userRole);
    _businessRules.RollcallDateCannotBeInFuture(request.Date);
    await _businessRules.RollcallTitleMustBeUniqueForGroupOnDateAsync(request.Title, request.GroupId, request.Date, cancellationToken: cancellationToken);

    List<Guid> memberIds = request.Entries.Select(e => e.MemberId).ToList();
    await _businessRules.AllMembersMustBelongToGroupAsync(request.GroupId, memberIds, cancellationToken);

    Rollcall rollcall = _mapper.CreateToEntity(request);

    await _rollcallRepository.AddAsync(rollcall, cancellationToken);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    CreatedRollcallResponseDto response = _mapper.EntityToCreatedResponseDto(rollcall);

    return new ReturnModel<CreatedRollcallResponseDto>()
    {
      Success = true,
      Message = "Yoklama başarılı bir şekilde kaydedildi.",
      Data = response,
      StatusCode = 201
    };
  }

  public async Task<ReturnModel<NoData>> UpdateAsync(
    UpdateRollcallRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _updateValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    Rollcall rollcall = await _businessRules.GetRollcallIfExistAsync(
      request.Id,
      include: q => q.Include(r => r.Entries).Include(r => r.Group).ThenInclude(g => g.Organization),
      enableTracking: true,
      cancellationToken: cancellationToken);

    await _businessRules.UserMustHavePermissionToManageRollcall(rollcall.GroupId, currentUserId, userRole);
    _businessRules.RollcallDateCannotBeInFuture(request.Date);
    await _businessRules.RollcallTitleMustBeUniqueForGroupOnDateAsync(request.Title, rollcall.GroupId, request.Date, rollcall.Id, cancellationToken);

    List<Guid> memberIds = request.Entries.Select(e => e.MemberId).ToList();
    await _businessRules.AllMembersMustBelongToGroupAsync(rollcall.GroupId, memberIds, cancellationToken);

    List<RollcallEntry> entriesToRemove = rollcall.Entries
      .Where(existing => !request.Entries.Any(dto => dto.Id == existing.Id))
      .ToList();

    foreach (var entry in entriesToRemove)
    {
      rollcall.Entries.Remove(entry);
    }

    foreach (UpdateRollcallEntryDto entryDto in request.Entries)
    {
      RollcallEntry? existingEntry = rollcall.Entries.FirstOrDefault(e => e.Id == entryDto.Id);
      if (existingEntry != null)
      {
        existingEntry.IsPresent = entryDto.IsPresent;
        existingEntry.Note = entryDto.Note;
      }
      else
      {
        rollcall.Entries.Add(new RollcallEntry
        {
          MemberId = entryDto.MemberId,
          IsPresent = entryDto.IsPresent,
          Note = entryDto.Note
        });
      }
    }

    _mapper.UpdateEntityFromRequest(request, rollcall);

    _rollcallRepository.Update(rollcall);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Yoklama kaydı başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    Rollcall rollcall = await _businessRules.GetRollcallIfExistAsync(
      id,
      include: q => q.Include(r => r.Group).ThenInclude(g => g.Organization),
      enableTracking: true,
      cancellationToken: cancellationToken);

    await _businessRules.UserMustHavePermissionToManageRollcall(rollcall.GroupId, currentUserId, userRole);

    _rollcallRepository.Delete(rollcall);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Yoklama kaydı başarılı bir şekilde silindi.",
      StatusCode = 200
    };
  }
}