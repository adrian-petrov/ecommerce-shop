using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityConfigurations
{
    public class ProductVariationConfiguration : IEntityTypeConfiguration<ProductVariation>
    {
        public void Configure(EntityTypeBuilder<ProductVariation> builder)
        {
            builder.Property(p => p.Id).IsRequired();
            builder.Property(p => p.Sku).IsRequired().HasMaxLength(80);
            builder.Property(p => p.VariationString).IsRequired().HasMaxLength(120);
            builder.Property(p => p.Price).IsRequired().HasColumnType("decimal(6,2)");
            builder.Property(p => p.TotalStock).IsRequired();
            builder
                .HasOne(b => b.Product)
                .WithMany(p => p.ProductVariations)
                .HasForeignKey(pv => pv.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
            builder.HasIndex(p => new { p.Sku }).IsUnique();
        }
    }
}