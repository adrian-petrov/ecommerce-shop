namespace API.Dtos
{
    public class BasketItemResponseDto
    {
        public int ProductVariationId { get; set; }
        public int ProductId { get; set; }
        public string ProductType { get; set; }
        public string ProductVariationString { get; set; }
        public string ProductName { get; set; }
        public string Colour { get; set; }
        public string Size { get; set; }
        public string Waist { get; set; }
        public string Length { get; set; }
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public int Quantity { get; set; }
        public int Stock { get; set; }
    }
}
