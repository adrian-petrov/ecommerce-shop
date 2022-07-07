using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;

namespace Core.Interfaces
{
    public interface IBasketService
    {
        Task AddItemToBasket(
            int basketId, 
            int productVariationId, 
            int quantity,
            decimal price);
        Task DeleteBasketAsync(int basketId);
        Task<Basket> GetOrCreateBasketForUserAsync(string username);
        Task<Basket> GetBasketForUserAsync(string username);
        Task TransferBasketAsync(string anonymousId, string username);
        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethods();
    }
}