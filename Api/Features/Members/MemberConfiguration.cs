using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Members;

public class MemberConfiguration : IEntityTypeConfiguration<Member>
{
  public void Configure(EntityTypeBuilder<Member> builder)
  {
    builder.ToTable("Members");

    builder.HasKey(m => m.Id);

    builder.Property(m => m.Id).HasColumnName("Id").IsRequired();
    builder.Property(m => m.CreatedDate).HasColumnName("CreatedDate").IsRequired();
    builder.Property(m => m.UpdatedDate).HasColumnName("UpdatedDate").IsRequired(false);

    builder.Property(m => m.FirstName).HasMaxLength(100).IsRequired();
    builder.Property(m => m.LastName).HasMaxLength(100).IsRequired();
    builder.Property(m => m.ExternalId).HasMaxLength(50).IsRequired(false);
    builder.Property(m => m.BirthDate).IsRequired(false);
    builder.Property(m => m.ProfileImageUrl).HasMaxLength(500).IsRequired(false);
    builder.Property(m => m.IsActive).HasDefaultValue(true);

    builder.HasOne(m => m.Group)
      .WithMany(g => g.Members)
      .HasForeignKey(m => m.GroupId)
      .OnDelete(DeleteBehavior.Cascade);
  }
}