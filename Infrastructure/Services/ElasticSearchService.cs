using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.ElasticsearchModels;
using Core.Interfaces;
using Nest;

namespace Infrastructure.Services
{
    public class ElasticSearchService : IElasticSearchService
    {
        private readonly IElasticClient _client;

        public ElasticSearchService(IElasticClient client)
        {
            _client = client;
        }

        public async Task<SearchResult<ElasticSearchProduct>> Search(string query, int pageIndex = 1, int pageSize = 6)
        {
            var result = await _client.SearchAsync<ElasticSearchProduct>(x => x
                .Query(q => q
                    .MultiMatch(mm => mm
                        .Query(query)
                        .Fields(f => f
                            .Fields(f1 => f1.Brand,
                                    f2 => f2.Name))
                        .Operator(Operator.And)
                        .Fuzziness(Fuzziness.EditDistance(1))
                    ))
                .From(pageSize * (pageIndex - 1))
                .Size(pageSize)
            );

            return new SearchResult<ElasticSearchProduct>()
            {
                Results = result.Documents,
                Count = (int)result.Total,
                PageIndex = pageIndex,
                PageSize = pageSize
            };
        }

        public async Task<IReadOnlyCollection<ElasticSearchProduct>> Autocomplete(string query)
        {
            var result = await _client.SearchAsync<ElasticSearchProduct>(x => x
                .Query(q => q
                    .MultiMatch(mm => mm
                        .Query(query)
                        .Fields(f => f
                            .Fields(f1 => f1.Brand,
                                f2 => f2.Name))
                        .Operator(Operator.And)
                        .Fuzziness(Fuzziness.EditDistance(1))
                    ))
            );
            return result.Documents;
        }

        public async Task IndexProduct(ElasticSearchProduct product)
        {
            var request = new IndexRequest<ElasticSearchProduct>(product, "products");
            await _client.IndexAsync(request);
        }

        public async Task DeleteProduct(ElasticSearchProduct product)
        {
            var request = new DeleteRequest("products", product.Id);
            await _client.DeleteAsync(request);
        }
    }
    
}