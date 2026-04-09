using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Rollcalls;

public class RollcallConfiguration : IEntityTypeConfiguration<Rollcall>
{
  public void Configure(EntityTypeBuilder<Rollcall> builder)
  {
    builder.ToTable("Rollcalls");

    builder.HasKey(r => r.Id);

    builder.Property(r => r.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(r => r.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(r => r.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(r => r.Title)
      .HasMaxLength(150)
      .IsRequired();

    builder.Property(r => r.Description)
      .HasMaxLength(500)
      .IsRequired(false);

    builder.Property(r => r.Date)
      .IsRequired();

    builder.HasOne(r => r.Group)
      .WithMany(g => g.Rollcalls)
      .HasForeignKey(r => r.GroupId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasIndex(r => r.Date);
  }
}