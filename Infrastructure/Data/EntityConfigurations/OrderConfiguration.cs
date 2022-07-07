using Core.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.EntityConfigurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            var navigation = builder.Metadata.FindNavigation(nameof(Order.OrderItems));
            navigation.SetPropertyAccessMode(PropertyAccessMode.Field);

            builder.Property(p => p.Id).IsRequired();
            builder.Property(p => p.Subtotal).IsRequired().HasColumnType("decimal(6,2)");
            builder.HasIndex(p => new { p.BuyerEmail });
            builder.OwnsOne(o => o.DeliveryAddress, a => a.WithOwner());
            builder.HasMany(o => o.OrderItems).WithOne();
        }
    }
}