namespace Api.Features.Organizations;

public static class OrganizationRegistration
{
  public static IServiceCollection AddOrganizationDependencies(this IServiceCollection services)
  {
    services.AddScoped<IOrganizationRepository, EfOrganizationRepository>();
    services.AddScoped<OrganizationBusinessRules>();
    services.AddSingleton<OrganizationMapper>();

    return services;
  }
}