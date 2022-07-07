using System.Collections.Generic;
using System.Threading.Tasks;
using Core.ElasticsearchModels;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IElasticSearchService
    {
        Task<SearchResult<ElasticSearchProduct>> Search(string query, int pageIndex, int pageSize);
        Task<IReadOnlyCollection<ElasticSearchProduct>> Autocomplete(string query);
        Task IndexProduct(ElasticSearchProduct product);
        Task DeleteProduct(ElasticSearchProduct product);
    }
}