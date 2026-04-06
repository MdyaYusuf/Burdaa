using Api.Core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public static class DataRegistration
{
  public static IServiceCollection AddDataDependencies(this IServiceCollection services, IConfiguration configuration)
  {
    services.AddDbContext<BaseDbContext>(options => options.UseNpgsql(configuration.GetConnectionString("PostgreConnection")));

    services.AddScoped<IUnitOfWork, UnitOfWork>();

    return services;
  }
}