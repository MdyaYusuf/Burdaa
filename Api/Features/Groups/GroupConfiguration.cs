using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Groups;

public class GroupConfiguration : IEntityTypeConfiguration<Group>
{
  public void Configure(EntityTypeBuilder<Group> builder)
  {
    builder.ToTable("Groups");
    builder.HasKey(g => g.Id);

    builder.Property(g => g.Name).HasColumnName("Name").HasMaxLength(150).IsRequired();
    builder.Property(g => g.Description).HasColumnName("Description").HasMaxLength(1000);
    builder.Property(g => g.IsActive).HasDefaultValue(true);

    builder.HasOne(g => g.Organization)
      .WithMany(o => o.Groups)
      .HasForeignKey(g => g.OrganizationId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasOne(g => g.Creator)
      .WithMany()
      .HasForeignKey(g => g.CreatorId)
      .OnDelete(DeleteBehavior.ClientCascade);
  }
}