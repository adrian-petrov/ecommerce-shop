using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Infrastructure.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private string _username;
        private Basket _basketModel;
        private readonly IBasketService _basketService;
        private readonly IAccountService _accountService;
        private readonly IMapper _mapper;
        
        public BasketController(
            IBasketService basketService, 
            IAccountService accountService,
            IMapper mapper)
        {
            _basketService = basketService;
            _accountService = accountService;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<BasketResponseDto>> GetBasket()
        {
            await SetBasketModelAsync();

            var basketDto = _mapper.Map<BasketResponseDto>(_basketModel);
            return basketDto;
        }

        // Insert or Update
        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<BasketResponseDto>> PutBasketItem(
            [FromRoute] int id, 
            [FromBody] BasketItemRequestDto basketItemRequestDto)
        {
            await SetBasketModelAsync();
            
            await _basketService.AddItemToBasket(
                _basketModel.Id,
                id,
                basketItemRequestDto.Quantity,
                basketItemRequestDto.Price);
            
            var basketDto = await GetBasket();
            return basketDto;
        }

        [HttpDelete]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task DeleteBasket()
        {
            await SetBasketModelAsync();
            await _basketService.DeleteBasketAsync(_basketModel.Id);
        }

        [HttpGet("delivery")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            var deliveryMethods = await _basketService.GetDeliveryMethods();
            return Ok(deliveryMethods);
        }

        // if the user is signed in, get the basket using their username (email), otherwise use the cookie value
        private async Task SetBasketModelAsync()
        {
            var user = (AppUser)HttpContext.Items["User"];

            if (user != null)
            {
                _basketModel = await _basketService.GetOrCreateBasketForUserAsync(user.UserName);
                return;
            }
            
            GetOrSetBasketCookie();
            _basketModel = await _basketService.GetOrCreateBasketForUserAsync(_username);
        }
        
        private void GetOrSetBasketCookie()
        {
            if (Request.Cookies.ContainsKey(Constants.BasketCookie))
            {
                _username = Request.Cookies[Constants.BasketCookie];
            }

            if (_username != null) return;

            _username = Guid.NewGuid().ToString();

            var cookieOptions = new CookieOptions
            {
                IsEssential = true,
                Expires = DateTime.Today.AddDays(14),
            };
            Response.Cookies.Append(Constants.BasketCookie, _username, cookieOptions);
        }
    }
}
