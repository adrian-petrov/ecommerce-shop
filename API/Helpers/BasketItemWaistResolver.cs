using System.Linq;
using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class BasketItemWaistResolver : IValueResolver<BasketItem, BasketItemResponseDto, string>
    {
        public string Resolve(BasketItem source, BasketItemResponseDto destination, string destMember, ResolutionContext context)
        {
            var productType = source.ProductVariation.Product.Type;
            var variationStringArray = source.ProductVariation.VariationString.Split("_").ToList();

            return productType switch
            {
                "Shorts" => variationStringArray[^1],
                "Trousers" => variationStringArray[^2],
                _ => null
            };
        }
    }
}