using Api.Core.Exceptions;

namespace Api.Features.Roles;

public class RoleBusinessRules(IRoleRepository _roleRepository)
{
  public async Task<Role> GetRoleIfExistAsync(
    int id,
    Func<IQueryable<Role>, IQueryable<Role>>? include = null,
    bool enableTracking = false,
    CancellationToken cancellationToken = default)
  {
    var role = await _roleRepository.GetByIdAsync(id, include, enableTracking, cancellationToken);

    if (role == null)
    {
      throw new NotFoundException($"{id} numaralı rol bulunamadı.");
    }

    return role;
  }

  public async Task NameMustBeUniqueAsync(string name, CancellationToken cancellationToken = default)
  {
    var exists = await _roleRepository.AnyAsync(x => x.Name == name, cancellationToken);

    if (exists)
    {
      throw new BusinessException("Rol için benzersiz bir isim kullanılmalıdır.");
    }
  }

  public void AdminRoleRequired(string userRole)
  {
    if (userRole != "Admin")
    {
      throw new ForbiddenException("Rol işlemleri için yetkiniz bulunmamaktadır.");
    }
  }
}