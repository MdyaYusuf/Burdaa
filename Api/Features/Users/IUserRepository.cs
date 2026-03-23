using Api.Core.Repositories;

namespace Api.Features.Users;

public interface IUserRepository : IRepository<User, Guid>
{
  Task<User?> GetUserByEmailAsync(string email);
  Task<bool> IsEmailUniqueAsync(string email);
}