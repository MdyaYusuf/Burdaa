namespace Api.Features.Users;

public static class UserRegistration
{
  public static IServiceCollection AddUserDependencies(this IServiceCollection services)
  {
    services.AddScoped<IUserRepository, EfUserRepository>();
    services.AddScoped<UserBusinessRules>();
    services.AddSingleton<UserMapper>();

    return services;
  }
}