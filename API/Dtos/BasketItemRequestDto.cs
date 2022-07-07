namespace API.Dtos
{
    public class BasketItemRequestDto
    {
        public int ProductVariationId { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}