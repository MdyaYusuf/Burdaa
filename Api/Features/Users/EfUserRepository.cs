using Microsoft.EntityFrameworkCore;
using Api.Core.Repositories;
using Api.Data;

namespace Api.Features.Users;

public class EfUserRepository : EfBaseRepository<BaseDbContext, User, Guid>, IUserRepository
{
  public EfUserRepository(BaseDbContext context) : base(context)
  {

  }

  public async Task<User?> GetUserByEmailAsync(string email)
  {
    return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
  }

  public async Task<bool> IsEmailUniqueAsync(string email)
  {
    return !await _context.Users.AnyAsync(u => u.Email == email);
  }
}