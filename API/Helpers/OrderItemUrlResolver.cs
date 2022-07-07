using API.Configurations;
using API.Dtos;
using AutoMapper;
using Core.Entities.OrderAggregate;
using Microsoft.Extensions.Options;

namespace API.Helpers
{
    public class OrderItemUrlResolver : IValueResolver<OrderItem, OrderItemResponseDto, string>
    {
        private readonly BaseUrlOptions _baseUrlOptions;

        public OrderItemUrlResolver(IOptions<BaseUrlOptions> baseUrlOptions)
        {
            _baseUrlOptions = baseUrlOptions.Value;
        }
        
        public string Resolve(
            OrderItem source, 
            OrderItemResponseDto destination, 
            string destMember, 
            ResolutionContext context)
        {
            return _baseUrlOptions.ProductsBase + source.ItemOrdered.PictureUrl;
        }
    }
}