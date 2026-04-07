using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using Api.Core.Middlewares;
using Api.Core.Security;
using Api.Data;
using Api.Features.Authentication;
using Api.Features.Groups;
using Api.Features.Members;
using Api.Features.Organizations;
using Api.Features.Roles;
using Api.Features.Rollcalls;
using Api.Features.Users;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options =>
{
  options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails();

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
  options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddDataDependencies(builder.Configuration);
builder.Services.AddUserDependencies();
builder.Services.AddRoleDependencies();
builder.Services.AddGroupDependencies();
builder.Services.AddMemberDependencies();
builder.Services.AddOrganizationDependencies();
builder.Services.AddRollcallDependencies();
builder.Services.AddAuthenticationDependencies();
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

builder.Services.Configure<TokenOptions>(builder.Configuration.GetSection("TokenOptions"));

var tokenOptions = builder.Configuration.GetSection("TokenOptions").Get<TokenOptions>() ?? throw new InvalidOperationException("TokenOptions bölümü yapılandırma dosyasında appsettings bulunamadı.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
    options.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuer = true,
      ValidateAudience = true,
      ValidateLifetime = true,
      ValidIssuer = tokenOptions.Issuer,
      ValidAudience = tokenOptions.Audience,
      ValidateIssuerSigningKey = true,
      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenOptions.SecurityKey)),
      ClockSkew = TimeSpan.Zero
    };
  });

builder.Services.AddCors(options =>
{
  options.AddDefaultPolicy(policy =>
  {
    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
  });
});

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
