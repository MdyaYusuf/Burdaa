using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Rollcalls;

public class RollcallConfiguration : IEntityTypeConfiguration<Rollcall>
{
  public void Configure(EntityTypeBuilder<Rollcall> builder)
  {
    builder.ToTable("Rollcalls");
    builder.Property(r => r.Title).HasMaxLength(150).IsRequired();

    builder.HasOne(r => r.Group)
      .WithMany(g => g.Rollcalls)
      .HasForeignKey(r => r.GroupId)
      .OnDelete(DeleteBehavior.Cascade);
  }
}