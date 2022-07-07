using System.Linq;
using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class AdminProductSpecification : Specification<Product>
    {
        public AdminProductSpecification(AdminListQueryParams listQueryParams)
        {
            if (listQueryParams.Filter.ContainsKey("brand"))
                Query.Where(p => p.ProductBrandId == int.Parse(listQueryParams.Filter["brand"]));

            if (listQueryParams.Filter.ContainsKey("type"))
                Query.Where(p => p.ProductTypeId == int.Parse(listQueryParams.Filter["type"]));
            
            if (listQueryParams.Filter.ContainsKey("name"))
                Query.Where(p => p.Name.Contains(listQueryParams.Filter["name"]));

            
            if (listQueryParams.Range != null && listQueryParams.Range.Count != 0)
            {
                var from = listQueryParams.Range.First();
                var to = listQueryParams.Range.Last();

                Query.Skip(from).Take(to - from + 1);
            }

            Query
                .Include(p => p.Images);

            if (listQueryParams.Sort == null || listQueryParams.Sort.Count == 0) return;

            var condition = listQueryParams.Sort.First();
            var order = listQueryParams.Sort.Last();

            if (order == "ASC")
            {
                _ = condition switch
                {
                    "id" => Query.OrderBy(p => p.Id),
                    "name" => Query.OrderBy(p => p.Name),
                    "type" => Query.OrderBy(p => p.Type),
                    "brand" => Query.OrderBy(p => p.Brand),
                    "basePrice" => Query.OrderBy(p => p.BasePrice),
                    _ => Query.OrderBy(p => p.Id)
                };
                return;
            }

            _ = condition switch
            {
                "id" => Query.OrderBy(p => p.Id),
                "name" => Query.OrderBy(p => p.Name),
                "type" => Query.OrderBy(p => p.Type),
                "brand" => Query.OrderBy(p => p.Brand),
                "basePrice" => Query.OrderBy(p => p.BasePrice),
                _ => Query.OrderBy(p => p.Id)
            };
        }

        public AdminProductSpecification(int id)
        {
            Query.Where(p => p.Id == id);

            Query
                .Include(p => p.ProductOptions)
                .ThenInclude(po => po.ProductOptionValues)
                .ThenInclude(pov => pov.Option)
                .Include(p => p.Images);
        }
    }
}