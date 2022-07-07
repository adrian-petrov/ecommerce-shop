using System.Collections.Generic;

namespace API.Dtos
{
    public class ProductResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal BasePrice { get; set; }
        public string Type { get; set; }
        public string Brand { get; set; }
        public IReadOnlyList<ProductOptionResponseDto> ProductOptions { get; set; }
        public IReadOnlyList<ProductVariationResponseDto> ProductVariations { get; set; }
        public IReadOnlyList<ImageResponseDto> Images { get; set; }
    }
}