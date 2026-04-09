using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Rollcalls;

public class RollcallEntryConfiguration : IEntityTypeConfiguration<RollcallEntry>
{
  public void Configure(EntityTypeBuilder<RollcallEntry> builder)
  {
    builder.ToTable("RollcallEntries");

    builder.HasKey(re => re.Id);

    builder.Property(re => re.Id)
      .HasColumnName("Id")
      .IsRequired();

    builder.Property(re => re.CreatedDate)
      .HasColumnName("CreatedDate")
      .IsRequired();

    builder.Property(re => re.UpdatedDate)
      .HasColumnName("UpdatedDate")
      .IsRequired(false);

    builder.Property(re => re.IsPresent)
      .IsRequired()
      .HasDefaultValue(false);

    builder.Property(re => re.Note)
      .HasMaxLength(250)
      .IsRequired(false);

    builder.HasOne(re => re.Rollcall)
      .WithMany(r => r.Entries)
      .HasForeignKey(re => re.RollcallId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasOne(re => re.Member)
      .WithMany(m => m.RollcallEntries)
      .HasForeignKey(re => re.MemberId)
      .OnDelete(DeleteBehavior.ClientCascade);

    builder.HasIndex(re => new { re.RollcallId, re.MemberId }).IsUnique();
  }
}