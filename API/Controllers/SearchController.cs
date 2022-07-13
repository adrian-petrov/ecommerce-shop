using System.Collections.Generic;
using System.Threading.Tasks;
using Core.ElasticsearchModels;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class SearchController : BaseApiController
    {
        private readonly IElasticSearchService _elasticSearchService;

        public SearchController(IElasticSearchService elasticSearchService)
        {
            _elasticSearchService = elasticSearchService;
        }

        [HttpPost]
        public async Task<ActionResult<SearchResult<ElasticSearchProduct>>> Search(
            [FromQuery] string query,
            [FromQuery] int pageIndex,
            [FromQuery] int pageSize)
        {
            var result = await _elasticSearchService.Search(query, pageIndex, pageSize);
            return Ok(result);
        }

        [HttpPost]
        [Route("autocomplete")]
        public async Task<ActionResult<IReadOnlyCollection<ElasticSearchProduct>>> Autocomplete(
            [FromQuery] string query)
        {
            var result = await _elasticSearchService.Autocomplete(query);
            return Ok(result);
        }
    }
}