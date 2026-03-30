using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.Members;

public interface IMemberService
{
  Task<ReturnModel<List<MemberResponseDto>>> GetAllAsync(
    Guid currentUserId,
    string userRole,
    Expression<Func<Member, bool>>? filter = null,
    Func<IQueryable<Member>, IQueryable<Member>>? include = null,
    Func<IQueryable<Member>, IOrderedQueryable<Member>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<MemberResponseDto>> GetAsync(
    Expression<Func<Member, bool>> predicate,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Member>, IQueryable<Member>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<MemberResponseDto>> GetByIdAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    Func<IQueryable<Member>, IQueryable<Member>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedMemberResponseDto>> AddAsync(
    CreateMemberRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateMemberRequest request,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    Guid currentUserId,
    string userRole,
    CancellationToken cancellationToken = default);
}