using Api.Core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public static class DataRegistration
{
  public static IServiceCollection AddDataDependencies(this IServiceCollection services, IConfiguration configuration)
  {
    services.AddDbContext<BaseDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("SqlConnection")));

    services.AddScoped<IUnitOfWork, UnitOfWork>();

    return services;
  }
}