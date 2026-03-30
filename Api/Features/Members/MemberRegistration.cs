namespace Api.Features.Members;

public static class MemberRegistration
{
  public static IServiceCollection AddMemberDependencies(this IServiceCollection services)
  {
    services.AddScoped<IMemberRepository, EfMemberRepository>();
    services.AddScoped<MemberBusinessRules>();
    services.AddSingleton<MemberMapper>();

    return services;
  }
}