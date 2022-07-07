using System.Linq;
using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class ProductPaginatedSpecification : Specification<Product>
    { 
        public ProductPaginatedSpecification(
            string productType,
            string gender,
            ProductQueryParams productQueryParams)
        {
            Query
                .Include(p => p.Images)
                .Skip(productQueryParams.PageSize * (productQueryParams.PageIndex - 1))
                .Take(productQueryParams.PageSize);
            
            if (productType == "hats")
            {
                Query.Where(p => p.Type == productType);
                return;
            }

            Query.Where(p => p.Type == productType &&
                             p.ProductOptions.Where(po => po.Name == "Gender")
                                 .Any(po => po.ProductOptionValues
                                     .Any(pov => pov.Name == gender)));
        }
    }
}