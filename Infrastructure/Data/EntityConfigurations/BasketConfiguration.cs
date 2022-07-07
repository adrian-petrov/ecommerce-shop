using Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityConfigurations
{
    public class BasketConfiguration : IEntityTypeConfiguration<Basket>
    {
        public void Configure(EntityTypeBuilder<Basket> builder)
        {
            builder.Property(p => p.Id).IsRequired();
            builder.Property(p => p.BuyerId).IsRequired();
            builder.HasIndex(p => p.BuyerId);
        }
    }
}       