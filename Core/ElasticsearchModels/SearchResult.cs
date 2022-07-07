using System.Collections.Generic;

namespace Core.ElasticsearchModels
{
    public class SearchResult<T>
    {
        public int PageSize { get; set; }
        public int PageIndex { get; set; }
        public int Count { get; set; }
        public IReadOnlyCollection<T> Results { get; set; }
    }
}