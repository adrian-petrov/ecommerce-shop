using System.Collections.Generic;
using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityConfigurations
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.Property(p => p.Id).IsRequired();
            builder.Property(p => p.Name).IsRequired().HasMaxLength(255);
            builder.Property(p => p.Description).IsRequired().HasColumnType("text");
            builder.Property(p => p.BasePrice).IsRequired().HasColumnType("decimal(6,2)");
            builder.Property(p => p.Type).IsRequired().HasMaxLength(50);
            builder.Property(p => p.Brand).IsRequired().HasMaxLength(70);
            builder
                .HasOne(b => b.ProductBrand)
                .WithMany()
                .HasForeignKey(p => p.ProductBrandId);
            builder
                .HasOne(t => t.ProductType)
                .WithMany()
                .HasForeignKey(p => p.ProductTypeId);
            builder
                .HasMany(p => p.Images)
                .WithOne(i => i.Product)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}