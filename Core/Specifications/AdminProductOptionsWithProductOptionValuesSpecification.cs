using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public class AdminProductOptionsWithProductOptionValuesSpecification : Specification<ProductOption>
    {
        public AdminProductOptionsWithProductOptionValuesSpecification(int id)
        {
            Query
                .Where(po => po.Id == id)
                .Include(po => po.ProductOptionValues);
        }
    }
}