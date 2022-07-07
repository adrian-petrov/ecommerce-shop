using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityConfigurations
{
    public class ProductOptionConfiguration : IEntityTypeConfiguration<ProductOption>
    {
        public void Configure(EntityTypeBuilder<ProductOption> builder)
        {
            builder.Property(p => p.Id).IsRequired();
            builder.Property(p => p.Name).HasMaxLength(25);
            builder.HasIndex(p => new { p.ProductId, p.Name }).IsUnique();
            builder
                .HasOne(p => p.Option)
                .WithMany()
                .HasForeignKey(p => p.OptionId);
            builder
                .HasMany(po => po.ProductOptionValues)
                .WithOne()
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}