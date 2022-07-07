using System.Collections.Generic;
using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class AdminProductTypesSpecification : Specification<ProductType>
    {
        public AdminProductTypesSpecification(AdminManyQueryParams manyQueryParams)
        {
            if (manyQueryParams.Filter.ContainsKey("ids"))
            {
                Query.Where(t => manyQueryParams.Filter["ids"].Contains(t.Id));
            }
        }
    }
}