using System.Reflection;
using Api.Features.Groups;
using Api.Features.Members;
using Api.Features.Organizations;
using Api.Features.Roles;
using Api.Features.Rollcalls;
using Api.Features.Users;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class BaseDbContext : DbContext
{
  public BaseDbContext(DbContextOptions<BaseDbContext> options) : base(options)
  {

  }

  public DbSet<User> Users { get; set; }
  public DbSet<Role> Roles { get; set; }
  public DbSet<Organization> Organizations { get; set; }
  public DbSet<Group> Groups { get; set; }
  public DbSet<Member> Members { get; set; }
  public DbSet<Rollcall> Rollcalls { get; set; }
  public DbSet<RollcallEntry> RollcallEntries { get; set; }

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
  }
}