using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Authorisation;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class OrderController : BaseApiController
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;

        public OrderController(IOrderService orderService, IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<OrderResponseDto>> GetOrder(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            var orderDto = _mapper.Map<OrderResponseDto>(order);
            return Ok(orderDto);
        }

        [HttpPost]
        public async Task<ActionResult> CreateOrder([FromBody]OrderRequestDto orderRequestDto)
        {
            var user = (AppUser)HttpContext.Items["User"];
            if (user == null)
                return BadRequest();

            var order = await _orderService.CreateOrderAsync(
                user.UserName,
                orderRequestDto.DeliveryAddress,
                orderRequestDto.BillingAddress,
                orderRequestDto.DeliveryMethodId);

            return Ok(_mapper.Map<OrderResponseDto>(order));

        }

        [HttpGet("{email}")]
        public async Task<ActionResult<OrderResponseDto>> GetOrders(string email)
        {
            var orders = await _orderService.GetOrdersForUserAsync(email);
            var ordersDto = _mapper.Map<IReadOnlyList<OrderResponseDto>>(orders);
            return Ok(ordersDto);
        }
    }
}