using System.Collections.Generic;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;

namespace Infrastructure.Services
{
    public class BasketService : IBasketService
    {
        private readonly IGenericRepository<Basket> _basketRepository;
        private readonly IGenericRepository<DeliveryMethod> _deliveryMethodRepository;

        public BasketService(IGenericRepository<Basket> basketRepository, IGenericRepository<DeliveryMethod> deliveryMethodRepository)
        {
            _basketRepository = basketRepository;
            _deliveryMethodRepository = deliveryMethodRepository;
        }
    
        public async Task AddItemToBasket(
            int basketId,
            int productVariationId,
            int quantity,
            decimal price)
        {
            var spec = new BasketWithItemsSpecification(basketId);
            var basket = await _basketRepository.FirstOrDefaultAsync(spec);
        
            basket.AddItem(productVariationId, quantity, price);
            await _basketRepository.UpdateAsync(basket);
        }
        
        public async Task DeleteBasketAsync(int basketId)
        {
            var basket = await _basketRepository.GetByIdAsync(basketId);
            await _basketRepository.DeleteAsync(basket);
        }
        
        public async Task<Basket> GetOrCreateBasketForUserAsync(string username)
        {
            var spec = new BasketWithItemsSpecification(username);
            var basket = await _basketRepository.FirstOrDefaultAsync(spec);
        
            if (basket != null)
            {
                return basket;
            }
        
            var newBasket = new Basket(username);
            newBasket = await _basketRepository.AddAsync(newBasket);
        
            return newBasket;
        }

        public async Task<Basket> GetBasketForUserAsync(string username)
        {
            var spec = new BasketWithItemsSpecification(username);
            var basket = await _basketRepository.FirstOrDefaultAsync(spec);

            return basket;
        }
        
        public async Task TransferBasketAsync(string anonymousId, string username)
        {
            var anonymousBasketSpec = new BasketWithItemsSpecification(anonymousId);
            var anonymousBasket = await _basketRepository.FirstOrDefaultAsync(anonymousBasketSpec);
        
            if (anonymousBasket == null) return;
        
            var userBasketSpec = new BasketWithItemsSpecification(username);
            var userBasket = await _basketRepository.FirstOrDefaultAsync(userBasketSpec);
        
            if (userBasket == null)
            {
                userBasket = new Basket(username);
                await _basketRepository.AddAsync(userBasket);
            }
        
            foreach (var item in anonymousBasket.Items)
            {
                userBasket.AddItem(item.ProductVariationId, item.Quantity, item.Price);
            }
        
            await _basketRepository.UpdateAsync(userBasket);
            await _basketRepository.DeleteAsync(anonymousBasket);
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethods()
        {
            return await _deliveryMethodRepository.ListAllAsync();
        }
    }
}

