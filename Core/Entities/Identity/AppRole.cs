using Microsoft.AspNetCore.Identity;
using System;

namespace Core.Entities.Identity
{
    public class AppRole : IdentityRole<int>
    {
        public AppRole()
        {
        }

        public AppRole(string roleName) : base(roleName)
        {
        }
    }
}