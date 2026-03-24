namespace Api.Features.Users;

public static class UserRegistration
{
  public static IServiceCollection AddUserFeature(this IServiceCollection services)
  {
    services.AddScoped<IUserRepository, EfUserRepository>();

    return services;
  }
}