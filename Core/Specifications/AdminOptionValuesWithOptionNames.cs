using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class AdminOptionValuesWithOptionNamesSpecification : Specification<OptionValue>
    {
        public AdminOptionValuesWithOptionNamesSpecification()
        {
            Query.Include(ov => ov.Option);
        }
        
    }
}