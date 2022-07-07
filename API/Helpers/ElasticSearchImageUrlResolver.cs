using System.Linq;
using API.Configurations;
using AutoMapper;
using Core.ElasticsearchModels;
using Core.Entities;
using Microsoft.Extensions.Options;

namespace API.Helpers
{
    public class ElasticSearchImageUrlResolver : IValueResolver<Product, ElasticSearchProduct, string>
    {
        private readonly BaseUrlOptions _baseUrlOptions;

        public ElasticSearchImageUrlResolver(IOptions<BaseUrlOptions> baseUrlOptions)
        {
            _baseUrlOptions = baseUrlOptions.Value;
        }
        
        public string Resolve(Product source, ElasticSearchProduct destination, string destMember, ResolutionContext context)
        {
            var image = source.Images.FirstOrDefault()?.ImageUrl;
            return _baseUrlOptions.ProductsBase + image;
;        }
    }
}