using System.Linq;
using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class BasketWithItemsSpecification : Specification<Basket>
    {
        public BasketWithItemsSpecification(int basketId)
        {
            Query
                .Where(b => b.Id == basketId)
                .Include(b => b.Items)
                .ThenInclude(i => i.ProductVariation)
                .ThenInclude(pv => pv.Product)
                .Include(b => b.Items)
                .ThenInclude(i => i.ProductVariation)
                .ThenInclude(pv => pv.ProductVariationImage);
        }
        
        public BasketWithItemsSpecification(string buyerId)
        {
            Query
                .Where(b => b.BuyerId == buyerId)
                .Include(b => b.Items)
                .ThenInclude(i => i.ProductVariation)
                .ThenInclude(pv => pv.Product)
                .Include(b => b.Items)
                .ThenInclude(i => i.ProductVariation)
                .ThenInclude(pv => pv.ProductVariationImage);
        }
    }
}