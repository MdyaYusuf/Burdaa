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
    builder.Property(o => o.Name).HasColumnName("Name").HasMaxLength(150).IsRequired();
    builder.Property(o => o.Address).HasColumnName("Address").HasMaxLength(500);
    builder.Property(o => o.LogoUrl).HasColumnName("LogoUrl").HasMaxLength(500);

    builder.HasOne(o => o.Owner)
      .WithMany()
      .HasForeignKey(o => o.OwnerId)
      .OnDelete(DeleteBehavior.Restrict);

    builder.HasIndex(o => o.Name);
  }
}