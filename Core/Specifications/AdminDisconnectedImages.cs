using System.Collections.Generic;
using System.Linq;
using Ardalis.Specification;
using Core.Entities;

namespace Core.Specifications
{
    public sealed class AdminDisconnectedImages : Specification<Image>
    {
        public AdminDisconnectedImages(IEnumerable<int> ids)
        {
            Query.Where(i => ids.Contains(i.Id));
        }
    }
}