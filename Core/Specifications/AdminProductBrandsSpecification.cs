using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class AdminProductBrandsSpecification : Specification<ProductBrand>
    {
        public AdminProductBrandsSpecification(AdminManyQueryParams manyQueryParams)
        {
            if (manyQueryParams.Filter.ContainsKey("ids"))
            {
                Query.Where(t => manyQueryParams.Filter["ids"].Contains(t.Id));
            }
        }
    }
}