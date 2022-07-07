using System.Linq;
using Ardalis.Specification;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrdersWithItemsSpecification : Specification<Order>
    {
        public OrdersWithItemsSpecification(string buyerEmail)
        {
            Query
                .AsNoTracking()
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.ItemOrdered)
                .Include(o => o.DeliveryMethod)
                .Where(x => x.BuyerEmail == buyerEmail);
        }
    }
}