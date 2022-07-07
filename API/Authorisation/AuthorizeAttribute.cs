using System;
using System.Linq;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Authorisation
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public string Roles { get; set; }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
            if (allowAnonymous)
                return;

            AppUser user;

            if (IsUserAdmin())
                user = (AppUser)context.HttpContext.Items["AdminUser"];
            else
                user = (AppUser)context.HttpContext.Items["User"];
            
            if (user == null)
                context.Result = new JsonResult(new
                {
                    message = "Unauthorized"
                })
                {
                    StatusCode = StatusCodes.Status401Unauthorized
                };
        }

        private bool IsUserAdmin()
        {
            if (Roles == null) return false;

            var roles = Roles.Split(",", StringSplitOptions.TrimEntries);
            return Array.Exists(roles, x => x == "Admin");
        }
    }
}