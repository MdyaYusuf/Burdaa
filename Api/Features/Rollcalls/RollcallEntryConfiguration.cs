using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Api.Features.Rollcalls;

public class RollcallEntryConfiguration : IEntityTypeConfiguration<RollcallEntry>
{
  public void Configure(EntityTypeBuilder<RollcallEntry> builder)
  {
    builder.ToTable("RollcallEntries");

    builder.HasOne(re => re.Rollcall)
      .WithMany(r => r.Entries)
      .HasForeignKey(re => re.RollcallId)
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasOne(re => re.Member)
      .WithMany()
      .HasForeignKey(re => re.MemberId)
      .OnDelete(DeleteBehavior.ClientCascade);
  }
}