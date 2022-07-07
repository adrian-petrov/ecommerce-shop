using System.Collections.Generic;

namespace API.Dtos
{
    public class AdminProductVariationResponseDto
    {
        public int Id { get; set; }
        public string Sku { get; set; }
        public string VariationString { get; set; }
        public decimal Price { get; set; }
        public int TotalStock { get; set; }
        public string Name { get; set; }
        public string Brand { get; set; }
        public string Type { get; set; }
        public string ImageUrl { get; set; }
        public List<AdminImageResponseDto> ProductImages { get; set; }
    }
}