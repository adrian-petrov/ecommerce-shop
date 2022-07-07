using System;
using System.Threading.Tasks;
using API.Authorisation;
using API.Dtos;
using AutoMapper;
using Core;
using Core.Entities.Identity;
using Core.Interfaces;
using Infrastructure.Authentication;
using Infrastructure.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

// ReSharper disable RouteTemplates.ActionRoutePrefixCanBeExtractedToControllerRoute

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminAccountController : BaseAdminController
    {
        private readonly IAccountService _accountService;
        private readonly IBasketService _basketService;
        private readonly IMapper _mapper;

        public AdminAccountController(
            IAccountService accountService,
            IBasketService basketService,
            IMapper mapper)
        {
            _accountService = accountService;
            _basketService = basketService;
            _mapper = mapper;
        }
        
        [HttpGet("account")]
        public UserResponseDto GetCurrentuser()
        {
            var user = (AppUser)HttpContext.Items["AdminUser"];
            var accessToken = (string)HttpContext.Items["AccessToken"];

            if (user == null || accessToken == null)
                return null;

            return new UserResponseDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                AccessToken = accessToken
            };
        }
        
        [HttpPost("account/authenticate")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthenticateResponse>> Authenticate(AuthenticateRequest authenticateRequest)
        {
            var fromAdminLogin = 
                HttpContext.Request.Path.Value != null && HttpContext.Request.Path.Value.StartsWith("/api/admin");
            
            var authResponse = await _accountService.AuthenticateAsync(
                authenticateRequest, 
                fromAdminLogin,
                IpAddress());

            SetTokenCookie(authResponse.RefreshToken);

            return Ok(authResponse);
        }
        
        [HttpPost("account/refresh-token")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthenticateResponse>> RefreshToken()
        {
            var refreshToken = Request.Cookies[Constants.AdminRefreshTokenCookie];
            var response = await _accountService.RefreshTokenAsync(refreshToken, IpAddress());

            SetTokenCookie(response.RefreshToken);

            return Ok(response);
        }
        
        [HttpPost("account/revoke-token")]
        [AllowAnonymous]
        public async Task<ActionResult> RevokeToken()
        {
            var token = Request.Cookies[Constants.AdminRefreshTokenCookie];
            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required " });

            Response.Cookies.Delete(Constants.AdminRefreshTokenCookie);

            await _accountService.RevokeTokenAsync(token, IpAddress());
            return Ok(new { message = "Token revoked" });
        }
        
        private string IpAddress()
        {
            if (Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];

            return HttpContext.Connection.RemoteIpAddress?.MapToIPv4().ToString();
        }

        private void SetTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                // these might be a pain in dev mode
                // SameSite = SameSiteMode.Lax,
                // Secure = true,
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append(Constants.AdminRefreshTokenCookie, token, cookieOptions);
        }
    }
}