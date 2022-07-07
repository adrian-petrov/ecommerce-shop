using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities.OrderAggregate
{
    [NotMapped]
    public class ProductItemOrdered
    {
        public int ProductVariationId { get; set; }
        public string ProductVariatingString { get; set; }
        public string ProductName { get; set; }
        public string PictureUrl { get; set; }
        
        public ProductItemOrdered()
        {
        }

        public ProductItemOrdered(
            int productVariationId, 
            string productVariatingString,
            string productName, 
            string pictureUrl)
        {
            ProductVariationId = productVariationId;
            ProductVariatingString = productVariatingString;
            ProductName = productName;
            PictureUrl = pictureUrl;
        }
    }
}