using System;
using API.Configurations;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace API.Helpers
{
    public class ProductVariationUrlResolver<T> : IValueResolver<ProductVariation, T, string>
    {
        private readonly BaseUrlOptions _baseUrlOptions;

        public ProductVariationUrlResolver(IOptions<BaseUrlOptions> baseUrlOptions)
        {
            _baseUrlOptions = baseUrlOptions.Value;
        }

        public string Resolve(
            ProductVariation source, 
            T destination, 
            string destMember,
            ResolutionContext context)
        {
            return _baseUrlOptions.ProductsBase + source.ProductVariationImage.ImageUrl;
        }
    }
}