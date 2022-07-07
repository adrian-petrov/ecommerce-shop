using API.Dtos;
using AutoMapper;
using Core.Entities;

namespace API.Helpers
{
    public class AdminOptionValueResolver : IValueResolver<OptionValue, AdminOptionValueResponseDto, string>
    {
        public string Resolve(OptionValue source, AdminOptionValueResponseDto destination, string destMember,
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