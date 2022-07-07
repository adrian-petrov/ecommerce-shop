using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityConfigurations
{
    public class BasketItemConfiguration : IEntityTypeConfiguration<BasketItem>
    {
        public void Configure(EntityTypeBuilder<BasketItem> builder)
        {
            builder.Property(p => p.Id).IsRequired();
            builder.Property(p => p.Quantity).IsRequired().HasColumnType("smallint");
            builder.Property(p => p.Price).IsRequired().HasColumnType("decimal(6,2)");
            builder.HasIndex(p => new { p.ProductVariationId, p.BasketId }).IsUnique();
            builder
                .HasOne(b => b.Basket)
                .WithMany(c => c.Items)
                .HasForeignKey(p => p.BasketId);
            builder
                .HasOne(b => b.ProductVariation)
                .WithMany(p => p.BasketItems)
                .HasForeignKey(p => p.ProductVariationId);
        }
    }
}
