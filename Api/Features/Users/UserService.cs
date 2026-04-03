using System.Linq.Expressions;
using Api.Core.Repositories;
using Api.Core.Responses;
using Api.Core.Security;
using FluentValidation;
using Microsoft.EntityFrameworkCore;

namespace Api.Features.Users;

public class UserService(
  IUserRepository _userRepository,
  UserMapper _mapper,
  UserBusinessRules _businessRules,
  IUnitOfWork _unitOfWork,
  IValidator<UpdateUserRequest> _updateValidator,
  IValidator<ChangePasswordRequest> _changePasswordValidator) : IUserService
{
  public async Task<ReturnModel<List<UserResponseDto>>> GetAllAsync(
    Guid currentUserId,
    string userRole,
    Expression<Func<User, bool>>? filter = null,
    Func<IQueryable<User>, IQueryable<User>>? include = null,
    Func<IQueryable<User>, IOrderedQueryable<User>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default)
  {
    _businessRules.UserMustBeOwnerOrAdmin(Guid.Empty, currentUserId, userRole);

    IQueryable<User> query = _userRepository.Query(enableTracking, withDeleted);

    if (filter != null)
    {
      query = query.Where(filter);
    }

    query = include != null
      ? include(query)
      : query.Include(u => u.Role).Include(u => u.Organizations).Include(u => u.Groups);

    if (orderBy != null)
    {
      query = orderBy(query);
    }

    List<User> users = await query.ToListAsync<User>(cancellationToken);
    List<UserResponseDto> response = _mapper.EntityToResponseDtoList(users);

    return new ReturnModel<List<UserResponseDto>>()
    {
      Success = true,
      Message = "Kullanıcı listesi başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<UserResponseDto>> GetAsync(
    Expression<Func<User, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<User>, IQueryable<User>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    User? user = await _userRepository.GetAsync(
      predicate,
      include: query => query.Include(u => u.Role).Include(u => u.Organizations).Include(u => u.Groups),
      enableTracking,
      cancellationToken);

    if (user == null)
    {
      return new ReturnModel<UserResponseDto>()
      {
        Success = true,
        Message = "Eşleşen kullanıcı bulunamadı.",
        Data = null,
        StatusCode = 200
      };
    }

    _businessRules.UserMustBeOwnerOrAdmin(user.Id, currentUserId, userRole);

    UserResponseDto response = _mapper.EntityToResponseDto(user);

    return new ReturnModel<UserResponseDto>()
    {
      Success = true,
      Message = "Kullanıcı bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<UserResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<User>, IQueryable<User>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    User user = await _businessRules.GetUserIfExistAsync(
      id,
      include: query => query.Include(u => u.Role).Include(u => u.Organizations).Include(u => u.Groups),
      enableTracking,
      cancellationToken);

    _businessRules.UserMustBeOwnerOrAdmin(user.Id, currentUserId, userRole);

    UserResponseDto response = _mapper.EntityToResponseDto(user);

    return new ReturnModel<UserResponseDto>()
    {
      Success = true,
      Message = "Kullanıcı bilgileri başarılı bir şekilde getirildi.",
      Data = response,
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> UpdateAsync(
    UpdateUserRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _updateValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    User user = await _businessRules.GetUserIfExistAsync(currentUserId, enableTracking: true, cancellationToken: cancellationToken);

    await _businessRules.UsernameMustBeUniqueAsync(request.Username, user.Id, cancellationToken);
    await _businessRules.EmailMustBeUniqueAsync(request.Email, user.Id, cancellationToken);

    _mapper.UpdateEntityFromRequest(request, user);

    _userRepository.Update(user);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Profil bilgileriniz başarılı bir şekilde güncellendi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> ChangePasswordAsync(
    ChangePasswordRequest request,
    Guid currentUserId,
    CancellationToken cancellationToken = default)
  {
    var validationResult = await _changePasswordValidator.ValidateAsync(request, cancellationToken);

    if (!validationResult.IsValid)
    {
      throw new ValidationException(validationResult.Errors);
    }

    User user = await _businessRules.GetUserIfExistAsync(currentUserId, enableTracking: true, cancellationToken: cancellationToken);

    _businessRules.PasswordMustMatch(request.CurrentPassword, user.PasswordHash, user.PasswordKey);

    HashingHelper.CreatePasswordHash(request.NewPassword, out string hash, out string key);
    user.PasswordHash = hash;
    user.PasswordKey = key;

    _userRepository.Update(user);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Şifreniz başarılı bir şekilde değiştirildi.",
      StatusCode = 200
    };
  }

  public async Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default)
  {
    _businessRules.UserMustBeOwnerOrAdmin(id, currentUserId, userRole);

    User user = await _businessRules.GetUserIfExistAsync(id, enableTracking: true, cancellationToken: cancellationToken);

    _userRepository.Delete(user);
    await _unitOfWork.SaveChangesAsync(cancellationToken);

    return new ReturnModel<NoData>()
    {
      Success = true,
      Message = "Kullanıcı hesabı başarılı bir şekilde silindi.",
      StatusCode = 200
    };
  }
}