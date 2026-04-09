using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Organizations;

public class OrganizationConfiguration : IEntityTypeConfiguration<Organization>
{
  public void Configure(EntityTypeBuilder<Organization> builder)
  {
    builder.ToTable("Organizations");

    builder.HasKey(o => o.Id);
    builder.Property(o => o.Id).HasColumnName("Id").IsRequired();

    builder.Property(o => o.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(o => o.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(o => o.Name)
      .HasColumnName("Name")
      .HasMaxLength(150)
      .IsRequired();

    builder.Property(o => o.Address)
      .HasColumnName("Address")
      .HasMaxLength(500)
      .IsRequired(false);

    builder.Property(o => o.LogoUrl)
      .HasColumnName("LogoUrl")
      .HasMaxLength(500)
      .IsRequired(false);

    builder.HasOne(o => o.Owner)
      .WithMany(u => u.Organizations)
      .HasForeignKey(o => o.OwnerId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasIndex(o => o.Name);
  }
}