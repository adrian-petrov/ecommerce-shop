namespace API.Dtos
{
    public class AdminProductVariationRequestDto
    {
        public int ProductId { get; set; }
        public decimal Price { get; set; }
        public int TotalStock { get; set; }
        public int Gender { get; set; }
        public int Colour { get; set; }
        public int Size { get; set; }
        public int Waist { get; set; }
        public int Length { get; set; }
        public int Image { get; set; }
    }
}