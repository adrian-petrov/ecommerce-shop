using Ardalis.Specification;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrderWithItemsSpecification : Specification<Order>
    {
        public OrderWithItemsSpecification(int id)
        {
            Query
                .AsNoTracking()
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.ItemOrdered)
                .Include(o => o.DeliveryMethod)
                .Where(x => x.Id == id);
        }
    }
}