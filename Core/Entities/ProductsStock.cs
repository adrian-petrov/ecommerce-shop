namespace Core.Entities
{
    public class ProductsStock : BaseEntity
    {
        public int TotalStock { get; set; }
        public decimal UnitPrice { get; set; }
        public int ProductVariationId { get; set; }
        public ProductVariation ProductVariation { get; set; }
    }
}