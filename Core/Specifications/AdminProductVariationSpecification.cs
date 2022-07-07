using System.Linq;
using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class AdminProductVariationSpecification : Specification<ProductVariation>
    {
        public AdminProductVariationSpecification(AdminListQueryParams listQueryParams)
        {
            if (listQueryParams.Filter.ContainsKey("brand"))
                Query.Where(p => p.Product.Brand.Contains(listQueryParams.Filter["brand"]));

            if (listQueryParams.Filter.ContainsKey("type"))
                Query.Where(p => p.Product.Type.Contains(listQueryParams.Filter["type"]));
            
            if (listQueryParams.Filter.ContainsKey("name"))
                Query.Where(p => p.Product.Name.Contains(listQueryParams.Filter["name"]));
            
            if (listQueryParams.Filter.ContainsKey("id"))
                Query.Where(pv => pv.ProductId == int.Parse(listQueryParams.Filter["id"]));

            if (listQueryParams.Range != null && listQueryParams.Range.Any())
            {
                var from = listQueryParams.Range.First();
                var to = listQueryParams.Range.Last();

                Query.Skip(from).Take(to - from + 1);
            }

            Query.Include(pv => pv.ProductVariationImage).Include(pv => pv.Product);

            var condition = listQueryParams.Sort.First();
            var order = listQueryParams.Sort.Last();

            if (order == "ASC")
            {
                _ = condition switch
                {
                    "id" => Query.OrderBy(pv => pv.Id),
                    "price" => Query.OrderBy(pv => pv.Price),
                    "stock" => Query.OrderBy(pv => pv.TotalStock),
                    _ => Query.OrderBy(p => p.Id)
                };
                return;
            }

            _ = condition switch
            {
                "id" => Query.OrderBy(pv => pv.Id),
                "price" => Query.OrderBy(pv => pv.Price),
                "stock" => Query.OrderBy(pv => pv.TotalStock),
                _ => Query.OrderBy(p => p.Id)
            };
        }

        public AdminProductVariationSpecification(int id)
        {
            Query.Where(pv => pv.Id == id);
            Query
                .Include(pv => pv.ProductVariationImage)
                .Include(pv => pv.Product)
                .ThenInclude(p => p.ProductOptions)
                .ThenInclude(po => po.ProductOptionValues)
                .Include(pv => pv.ProductsStock);
        }
    }
}