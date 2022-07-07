using API.Configurations;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Options;

namespace API.Helpers
{
    public class ImageUrlResolver<T> : IValueResolver<Image, T, string>
    {
        private readonly BaseUrlOptions _baseUrlOptions;
        
        public ImageUrlResolver(IOptions<BaseUrlOptions> baseUrlOptions)
        {
            _baseUrlOptions = baseUrlOptions.Value;
        }
        
        public string Resolve(Image source, T destination, string destMember, ResolutionContext context)
        {
            return _baseUrlOptions.ProductsBase + source.ImageUrl;
        }
    }
}