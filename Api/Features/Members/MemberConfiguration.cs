using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Members;

public class MemberConfiguration : IEntityTypeConfiguration<Member>
{
  public void Configure(EntityTypeBuilder<Member> builder)
  {
    builder.ToTable("Members");
    builder.HasKey(m => m.Id);

    builder.Property(m => m.FirstName).HasMaxLength(50).IsRequired();
    builder.Property(m => m.LastName).HasMaxLength(50).IsRequired();
    builder.Property(m => m.ExternalId).HasMaxLength(100);
    builder.Property(m => m.IsActive).HasDefaultValue(true);

    builder.HasOne(m => m.Group)
      .WithMany(g => g.Members)
      .HasForeignKey(m => m.GroupId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasIndex(m => m.ExternalId);
  }
}