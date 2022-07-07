using System.Collections.Generic;
using Core.Entities;

namespace API.Dtos
{
    public class FilterResponseDto
    {
        public IReadOnlyList<ProductTypeResponseDto> Types { get; set; }
        public IReadOnlyList<ProductBrandResponseDto> Brands { get; set; }
        public IReadOnlyList<OptionResponseDto> Options { get; set; }
        public IReadOnlyList<string> SortOptions { get; set; }
    }
}