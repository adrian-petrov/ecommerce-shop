using API.Configurations;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Options;

namespace API.Helpers
{
    public class BasketItemUrlResolver : IValueResolver<BasketItem, BasketItemResponseDto, string>
    {
        private readonly BaseUrlOptions _baseUrlOptions;

        public BasketItemUrlResolver(IOptions<BaseUrlOptions> baseUrlOptions)
        {
            _baseUrlOptions = baseUrlOptions.Value;
        }
        
        public string Resolve(BasketItem source, BasketItemResponseDto destination, string destMember, ResolutionContext context)
        {
            return _baseUrlOptions.ProductsBase + source.ProductVariation.ProductVariationImage.ImageUrl;
        }
    }
}