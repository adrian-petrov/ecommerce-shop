using System.Collections.Generic;

namespace Core.Specifications
{
    public class AdminListQueryParams
    {
        public IReadOnlyDictionary<string, string> Filter { get; set; }
        public List<int> Range { get; set; }
        public List<string> Sort { get; set; }
    }
}