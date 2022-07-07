using System.Collections.Generic;

namespace API.Dtos
{
    public class ProductOptionResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IReadOnlyList<ProductOptionValueResponseDto> ProductOptionValues { get; set; }
    }
}