using System.Linq;
using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class OptionWithValuesSpecification : Specification<Option>
    {
        public OptionWithValuesSpecification()
        {
            Query.Include(o => o.OptionValues);
        }
    }
}