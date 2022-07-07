namespace Core.Entities
{
    public class ProductVariationImage : BaseEntity
    {
        public string ImageUrl { get; set; }
        public int ProductVariationId { get; set; }
        public ProductVariation ProductVariation { get; set; }
    }
}