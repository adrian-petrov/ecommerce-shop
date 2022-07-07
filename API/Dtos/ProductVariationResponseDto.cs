namespace API.Dtos
{
    public class ProductVariationResponseDto
    {
        public int Id { get; set; }
        public string Sku { get; set; }
        public string VariationString { get; set; }
        public decimal Price { get; set; }
        public int TotalStock { get; set; }
        public string ImageUrl { get; set; }
    }
}