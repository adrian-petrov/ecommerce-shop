using System.Collections.Generic;
using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class AdminProductVariationCountSpecification : Specification<ProductVariation>
    {
        public AdminProductVariationCountSpecification(IReadOnlyDictionary<string, string> filter)
        {
            if (filter.ContainsKey("brand"))
                Query.Where(p => p.Product.ProductBrandId == int.Parse(filter["brand"]));

            if (filter.ContainsKey("type"))
                Query.Where(p => p.Product.ProductTypeId == int.Parse(filter["type"]));
            
            if (filter.ContainsKey("name"))
                Query.Where(p => p.Product.Name.Contains(filter["name"]));
            
            if (filter.ContainsKey("id"))
                Query.Where(pv => pv.ProductId == int.Parse(filter["id"]));
        }
    }
}