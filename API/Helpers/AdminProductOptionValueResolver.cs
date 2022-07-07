using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class AdminProductOptionValueResolver : IValueResolver<ProductOptionValue,
        AdminProductOptionValueResponseDto, string>
    {
        public string Resolve(ProductOptionValue source, AdminProductOptionValueResponseDto destination,
            string destMember,
            ResolutionContext context)
        {
            return source.Option.Name switch
            {
                "Waist" => source.Name + "W",
                "Length" => source.Name + "L",
                _ => source.Name
            };
        }
    }
}