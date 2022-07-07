using Core.Entities;
using Core.Entities.OrderAggregate;

namespace API.Dtos
{
    public class OrderRequestDto
    {
        public Address DeliveryAddress { get; set; }
        public BillingAddress BillingAddress { get; set; }
        public int DeliveryMethodId { get; set; }
    }
}