using System;

namespace Core.Entities
{
    public class BasketItem : BaseEntity
    {
        public int ProductVariationId { get; set; }
        public ProductVariation ProductVariation { get; set; }
        public int BasketId { get; private set; }
        public Basket Basket { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }


        public BasketItem(
            int productVariationId, 
            int quantity, 
            decimal price)
        {
            ProductVariationId = productVariationId;
            Quantity = quantity;
            Price = price;
        }

        public BasketItem()
        {
        }

        public void SetQuantity(int quantity)
        {
            Quantity = quantity;
        }
    }
}