using System.Linq;
using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class BasketItemSizeResolver : IValueResolver<BasketItem, BasketItemResponseDto, string>
    {
        public string Resolve(BasketItem source, BasketItemResponseDto destination, string destMember,
            ResolutionContext context)
        {
            if (source.ProductVariation.Product.Type is not "T-Shirts" or "Shoes")
                return null;
            
            var variationStringArray = source.ProductVariation.VariationString.Split("_");
            return variationStringArray[^1];
        }
    }
}