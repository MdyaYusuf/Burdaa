namespace Api.Features.Rollcalls;

public static class RollcallRegistration
{
  public static IServiceCollection AddRollcallDependencies(this IServiceCollection services)
  {
    services.AddScoped<IRollcallRepository, EfRollcallRepository>();
    services.AddScoped<IRollcallEntryRepository, EfRollcallEntryRepository>();
    services.AddScoped<RollcallBusinessRules>();
    services.AddScoped<IRollcallService, RollcallService>();
    services.AddSingleton<RollcallMapper>();

    return services;
  }
}