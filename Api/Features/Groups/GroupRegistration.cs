namespace Api.Features.Groups;

public static class GroupRegistration
{
  public static IServiceCollection AddGroupDependencies(this IServiceCollection services)
  {
    services.AddScoped<IGroupRepository, EfGroupRepository>();
    services.AddScoped<GroupBusinessRules>();
    services.AddScoped<IGroupService, GroupService>();
    services.AddSingleton<GroupMapper>();

    return services;
  }
}