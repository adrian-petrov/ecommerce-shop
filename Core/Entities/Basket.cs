using Core.Entities.Identity;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Core.Entities
{
    public class Basket : BaseEntity
    {
        public string BuyerId { get; private set; }
        public List<BasketItem> Items { get; private set; }

        public Basket(string buyerId)
        {
            BuyerId = buyerId;
        }

        public void AddItem(int productVariationId, int quantity, decimal price)
        {
            Items ??= new List<BasketItem>();
            
            var existingItem = Items.FirstOrDefault(i => i.ProductVariationId == productVariationId);

            if (existingItem == null)
            {
                if (quantity < 0) return;
                Items.Add(new BasketItem(productVariationId, quantity, price));
            }
            else
            {
                existingItem.SetQuantity(quantity);
                if (existingItem.Quantity == 0)
                    Items.Remove(existingItem);
            }
        }
    }
}