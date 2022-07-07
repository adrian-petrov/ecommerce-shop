using System.Collections.Generic;

namespace API.Dtos
{
    public class AdminProductRequestDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal BasePrice { get; set; }
        public int ProductTypeId { get; set; }
        public int ProductBrandId { get; set; }
        public IReadOnlyList<int> ProductOptions { get; set; }
        public IReadOnlyList<AdminProductOptionValueResponseDto> ProductOptionValues { get; set; }
        public IReadOnlyList<AdminImageResponseDto> Images { get; set; }
    }
}