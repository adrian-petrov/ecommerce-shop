namespace API.Dtos
{
    public class OrderItemResponseDto
    {
        public int ProductVariationId { get; set; }
        public string ProductVariationString { get; set; }
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}