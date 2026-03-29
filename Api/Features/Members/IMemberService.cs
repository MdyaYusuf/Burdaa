using System.Linq.Expressions;
using Api.Core.Responses;

namespace Api.Features.Members;

public interface IMemberService
{
  Task<ReturnModel<List<MemberResponseDto>>> GetAllAsync(
    Expression<Func<Member, bool>>? filter = null,
    Func<IQueryable<Member>, IQueryable<Member>>? include = null,
    Func<IQueryable<Member>, IOrderedQueryable<Member>>? orderBy = null,
    bool enableTracking = false,
    bool withDeleted = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<MemberResponseDto>> GetAsync(
    Expression<Func<Member, bool>> predicate,
    Func<IQueryable<Member>, IQueryable<Member>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<MemberResponseDto>> GetByIdAsync(
    Guid id,
    Func<IQueryable<Member>, IQueryable<Member>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<CreatedMemberResponseDto>> AddAsync(
    CreateMemberRequest request,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> UpdateAsync(
    UpdateMemberRequest request,
    CancellationToken cancellationToken = default);

  Task<ReturnModel<NoData>> RemoveAsync(
    Guid id,
    CancellationToken cancellationToken = default);
}