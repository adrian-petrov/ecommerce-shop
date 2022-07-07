using System.Collections.Generic;

namespace API.Dtos
{
    public class AdminProductResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal BasePrice { get; set; }
        public int ProductTypeId { get; set; }
        public int ProductBrandId { get; set; }
        public string Type { get; set; }
        public string Brand { get; set; }
        public IReadOnlyList<AdminProductOptionResponseDto> ProductOptions { get; set; }
        public IReadOnlyList<AdminImageResponseDto> Images { get; set; }
    }
}