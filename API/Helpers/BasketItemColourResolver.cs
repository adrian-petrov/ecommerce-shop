using System.Linq;
using System.Text;
using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class BasketItemColourResolver : IValueResolver<BasketItem, BasketItemResponseDto, string>
    {
        public string Resolve(BasketItem source, BasketItemResponseDto destination, string destMember, ResolutionContext context)
        {
            var variationOptions = source.ProductVariation.VariationString.Split("_").Skip(3).ToList();
            var colour = variationOptions[0];

            var firstUpperCase = true;
            var stringBuilder = new StringBuilder();
            
            foreach (var c in colour)
            {
                if (char.IsUpper(c) && firstUpperCase)
                {
                    stringBuilder.Append(c);
                    firstUpperCase = false;
                    continue;
                }
                
                if (char.IsUpper(c) && !firstUpperCase)
                {
                    stringBuilder.Append($" {c}");
                    continue;
                }
                
                stringBuilder.Append(c);
            }
            return stringBuilder.ToString();
        }
    }
}