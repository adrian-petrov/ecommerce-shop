using System;
using System.Linq;
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

namespace API.Controllers
{
    [Authorize]
    public class AccountController : BaseApiController
    {
        private readonly IAccountService _accountService;
        private readonly IBasketService _basketService;
        private readonly IMapper _mapper;

        public AccountController(
            IAccountService accountService,
            IBasketService basketService,
            IMapper mapper)
        {
            _accountService = accountService;
            _basketService = basketService;
            _mapper = mapper;
        }

        [HttpGet]
        public UserResponseDto GetCurrentuser()
        {
            var user = (AppUser)HttpContext.Items["User"];
            var accessToken = (string)HttpContext.Items["AccessToken"];

            if (user == null || accessToken == null)
                return null;

            return new UserResponseDto()
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                AccessToken = accessToken
            };
        }

        [HttpGet("billing-address/{username}")]
        public async Task<BillingAddressResponseDto> GetCurrentUserBillingAddress(string username)
        {
            var user = await _accountService.GetUserByUsernameAsync(username);
            return _mapper.Map<BillingAddressResponseDto>(user.BillingAddress);
        }

        [HttpPut("details")]
        public async Task<UserDetailsResponseDto> UpdateUserDetails(UserDetailsRequestDto userDetailsRequestDto)
        {
            var user = await _accountService.UpdateUserDetailsAsync(
                userDetailsRequestDto.Email,
                userDetailsRequestDto.FirstName,
                userDetailsRequestDto.LastName,
                userDetailsRequestDto.BillingAddress);

            var response = new UserDetailsResponseDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                BillingAddress = _mapper.Map<BillingAddressResponseDto>(user.BillingAddress)
            };

            return response;
        }

        [HttpPut("email")]
        public async Task<ActionResult<AuthenticateResponse>> UpdateEmailAddress([FromBody] EmailAddressRequestDto
            emailAddressRequestDto)
        {
            await _accountService.UpdateEmailAddressAsync(emailAddressRequestDto.CurrentEmail, emailAddressRequestDto
                .NewEmail);
            
            // then refresh token
            var refreshToken = Request.Cookies[Constants.RefreshTokenCookie];
            var response = await _accountService.RefreshTokenAsync(refreshToken, IpAddress());
            
            SetTokenCookie(response.RefreshToken);
            return response;
        }

        [HttpPut("password")]
        public async Task<ActionResult<PasswordChangeResponseDto>> UpdatePassword([FromBody] PasswordChangeRequestDto
            passwordChangeRequestDto)
        {
            var result = await _accountService.UpdatePasswordAsync(
                passwordChangeRequestDto.Email,
                passwordChangeRequestDto.CurrentPassword,
                passwordChangeRequestDto.NewPassword);

            var response = new PasswordChangeResponseDto
            {
                Errors = result.Errors.Select(x => x.Description),
                Succeeded = result.Succeeded
            };

            return response;
        }

        [HttpPost("authenticate")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthenticateResponse>> Authenticate(AuthenticateRequest authenticateRequestDto)
        {
            var fromAdminLogin = 
                HttpContext.Request.Path.Value != null && HttpContext.Request.Path.Value.StartsWith("/api/admin");
            
            var authResponse = await _accountService.AuthenticateAsync(authenticateRequestDto, fromAdminLogin, 
            IpAddress());

            await TransferAnonymousBasketToUserAsync(authenticateRequestDto.Username);
            SetTokenCookie(authResponse.RefreshToken);

            return Ok(authResponse);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult> Register(RegisterRequest registerRequestDto)
        {
            var response = await _accountService.RegisterAccountAsync(registerRequestDto, IpAddress());

            await TransferAnonymousBasketToUserAsync(registerRequestDto.Email);
            SetTokenCookie(response.RefreshToken);
            
            return Ok(response);
        }

        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthenticateResponse>> RefreshToken()
        {
            var refreshToken = Request.Cookies[Constants.RefreshTokenCookie];
            var response = await _accountService.RefreshTokenAsync(refreshToken, IpAddress());

            SetTokenCookie(response.RefreshToken);

            return Ok(response);
        }

        [HttpPost("revoke-token")]
        [AllowAnonymous]
        public async Task<ActionResult> RevokeToken()
        {
            var token = Request.Cookies[Constants.RefreshTokenCookie];
            if (string.IsNullOrEmpty(token))
                return BadRequest(new { message = "Token is required " });

            Response.Cookies.Delete(Constants.RefreshTokenCookie);

            await _accountService.RevokeTokenAsync(token, IpAddress());
            return Ok(new { message = "Token revoked" });
        }

        private async Task TransferAnonymousBasketToUserAsync(string username)
        {
            if (Request.Cookies.ContainsKey(Constants.BasketCookie))
            {
                var anonymousId = Request.Cookies[Constants.BasketCookie];
                await _basketService.TransferBasketAsync(anonymousId, username);
                Response.Cookies.Delete(Constants.BasketCookie);
            }
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
                SameSite = SameSiteMode.Lax,
                Secure = true,
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append(Constants.RefreshTokenCookie, token, cookieOptions);
        }
    }
}