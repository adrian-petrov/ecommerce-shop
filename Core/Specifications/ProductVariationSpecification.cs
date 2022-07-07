using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class ProductVariationSpecification : Specification<ProductVariation>
    {
        public ProductVariationSpecification(int id)
        {
            Query
                .Where(pv => pv.Id == id)
                .Include(pv => pv.ProductsStock)
                .Include(pv => pv.Product)
                .ThenInclude(p => p.ProductOptions)
                .ThenInclude(po => po.ProductOptionValues);
        }
    }
}