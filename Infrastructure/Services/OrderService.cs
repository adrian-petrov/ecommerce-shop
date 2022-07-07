using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Interfaces;

namespace Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBasketService _basketService;
        private readonly IAccountService _accountService;

        public OrderService(
            IUnitOfWork unitOfWork,
            IBasketService basketService,
            IAccountService accountService)
        {
            _unitOfWork = unitOfWork;
            _basketService = basketService;
            _accountService = accountService;
        }
        
        public async Task<Order> CreateOrderAsync(
            string username,
            Address deliveryAddress, 
            BillingAddress billingAddress, 
            int deliveryMethodId)
        {
            // update billing address
            await _accountService.UpdateBillingAddressAsync(username, billingAddress);
            
            // get basket and create order items
            var basket = await _basketService.GetBasketForUserAsync(username);
            var orderItems = new List<OrderItem>();

            foreach (var basketItem in basket.Items)
            {
                var productItemOrdered = new ProductItemOrdered(
                    basketItem.ProductVariationId,
                    basketItem.ProductVariation.VariationString,
                    basketItem.ProductVariation.Product.Name,
                    basketItem.ProductVariation.ProductVariationImage.ImageUrl);
                var orderItem = new OrderItem(
                    productItemOrdered,
                    basketItem.Price,
                    basketItem.Quantity);

                orderItems.Add(orderItem);

                // update variation stock and optionValues stock
                var spec = new ProductVariationSpecification(basketItem.ProductVariationId);
                var productVariation = await _unitOfWork.Repository<ProductVariation>().FirstOrDefaultAsync(spec);
                productVariation.RemoveStock(basketItem.Quantity);
                productVariation.RemoveOptionValuesStock(basketItem.Quantity);
            }


            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliveryMethodId);
            
            var subtotal = orderItems.Sum(item => item.Price * item.Quantity);
            
            var order = new Order(
                orderItems,
                username,
                new Address(
                    deliveryAddress.FirstName,
                    deliveryAddress.LastName,
                    deliveryAddress.Street1,
                    deliveryAddress.Street2,
                    deliveryAddress.Town,
                    deliveryAddress.County,
                    deliveryAddress.Postcode),
                deliveryMethod,
                subtotal);
            
            _unitOfWork.Repository<Order>().Add(order);

            var result = await _unitOfWork.Complete();

            return result <= 0 ? null : order;
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsSpecification(buyerEmail);
            var orders = await _unitOfWork.Repository<Order>().ListAsync(spec);
            await _unitOfWork.Complete();

            return orders;
        }

        public async Task<Order> GetOrderByIdAsync(int id)
        {
            var spec = new OrderWithItemsSpecification(id);
            var order = await _unitOfWork.Repository<Order>().FirstOrDefaultAsync(spec);
            await _unitOfWork.Complete();

            return order;
        }
    }
}