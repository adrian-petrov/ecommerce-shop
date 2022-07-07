using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class ProductSpecification : Specification<Product>
    {
        public ProductSpecification(int id)
        {
            Query
                .Where(p => p.Id == id)
                .Include(p => p.ProductOptions)
                .ThenInclude(po => po.ProductOptionValues)
                .Include(p => p.ProductVariations)
                .ThenInclude(pv => pv.ProductVariationImage);
        }
    }
}