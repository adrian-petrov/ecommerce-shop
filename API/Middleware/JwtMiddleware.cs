using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Core;
using Core.Exceptions;
using Infrastructure.Interfaces;
using Microsoft.AspNetCore.Http;

namespace API.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(
            HttpContext context, 
            IJwtUtils jwtUtils, 
            IAccountService accountService)
        {
            if (context.Request.Path.Value == null)
                return;
            
            if (context.Request.Path.Value.StartsWith("/api/admin"))
            {
                await HandleAdminAuthenticationAsync(context, jwtUtils, accountService);
                return;
            }

            await HandleStoreUserAuthenticationAsync(context, jwtUtils, accountService);
        }

        private async Task HandleAdminAuthenticationAsync(
            HttpContext context,
            IJwtUtils jwtUtils,
            IAccountService accountService)
        {
            var accessToken = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            var refreshToken = context.Request.Cookies[Constants.AdminRefreshTokenCookie];
            var serializerOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            if (context.Request.Path.Value == null)
                return;
            
            // user is signed in but accessToken has been erased from memory
            // the client will intercept the AccessTokenNotFound response and 
            // attempt to refresh the token
            if (
                accessToken == null && 
                refreshToken != null &&
                // skip if the user is trying to refresh or revoke the token or authenticate
                !context.Request.Path.Value.StartsWith("/api/admin/account/refresh-token") &&
                !context.Request.Path.Value.StartsWith("/api/admin/account/revoke-token") &&
                !context.Request.Path.Value.StartsWith("/api/admin/account/authenticate"))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;

                await context.Response.WriteAsJsonAsync(new
                {
                    Message = Constants.AccessTokenNotFound
                }, serializerOptions);

                return;
            }
            
            if (accessToken != null && 
                refreshToken != null &&
                !context.Request.Path.Value.StartsWith("/api/admin/account/refresh-token") &&
                !context.Request.Path.Value.StartsWith("/api/admin/account/revoke-token") &&
                !context.Request.Path.Value.StartsWith("/api/admin/account/authenticate"))
            {
                var username = jwtUtils.ValidateToken(accessToken, true);
                // user is signed in but accessToken has expired or is invalid
                if (username == null)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        Message = Constants.AccessTokenInvalid
                    }, serializerOptions);

                    return;
                }

                // accessToken is valid so populate the context with the current user
                var user = await accountService.GetUserByUsernameAsync(username);
                context.Items["AdminUser"] = user;
                context.Items["AccessToken"] = accessToken;
            }
            await _next(context);
        }
        
        private async Task HandleStoreUserAuthenticationAsync(
            HttpContext context,
            IJwtUtils jwtUtils,
            IAccountService accountService)
        {
            var accessToken = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            var refreshToken = context.Request.Cookies[Constants.RefreshTokenCookie];
            var serializerOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            if (context.Request.Path.Value == null)
                return;
            
            // user is signed in but accessToken has been erased from memory
            // the client will intercept the AccessTokenNotFound response and 
            // attempt to refresh the token
            if (
                accessToken == null && 
                refreshToken != null &&
                // skip if the user is trying to refresh or revoke the token
                !context.Request.Path.Value.StartsWith("/api/account/refresh-token") &&
                !context.Request.Path.Value.StartsWith("/api/account/revoke-token"))
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;

                await context.Response.WriteAsJsonAsync(new
                {
                    Message = Constants.AccessTokenNotFound
                }, serializerOptions);

                return;
            }
            
            if (accessToken != null && 
                refreshToken != null &&
                !context.Request.Path.Value.StartsWith("/api/account/refresh-token") &&
                !context.Request.Path.Value.StartsWith("/api/account/revoke-token"))
            {
                var username = jwtUtils.ValidateToken(accessToken, false);
                // user is signed in but accessToken has expired or is invalid
                if (username == null)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        Message = Constants.AccessTokenInvalid
                    }, serializerOptions);

                    return;
                }

                // accessToken is valid so populate the context with the current user
                var user = await accountService.GetUserByUsernameAsync(username);
                context.Items["User"] = user;
                context.Items["AccessToken"] = accessToken;
            }
            await _next(context);
        }
    }
}