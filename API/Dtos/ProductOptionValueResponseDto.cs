namespace API.Dtos
{
    public class ProductOptionValueResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OptionId { get; set; }
        public int ProductOptionId { get; set; }
        public int Stock { get; set; }
    }
}