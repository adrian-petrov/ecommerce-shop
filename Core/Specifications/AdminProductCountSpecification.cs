using System.Collections.Generic;
using System.Linq;
using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class AdminProductCountSpecification : Specification<Product>
    {
        public AdminProductCountSpecification(IReadOnlyDictionary<string, string> filter)
        {
            if (filter.ContainsKey("brand"))
                Query.Where(p => p.ProductBrandId == int.Parse(filter["brand"]));

            if (filter.ContainsKey("type"))
                Query.Where(p => p.ProductTypeId == int.Parse(filter["type"]));

            if (filter.ContainsKey("name"))
                Query.Where(p => p.Name.Contains(filter["name"]));
        }

    }
}