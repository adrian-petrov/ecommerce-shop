using System.Collections.Generic;
using System.Security.Claims;
using Core.Entities.Identity;

namespace Infrastructure.Interfaces
{
    public interface IJwtUtils
    {
        public string GenerateJwtToken(List<Claim> claims);
        public RefreshToken GenerateRefreshToken(string ipAddress);
        public string ValidateToken(string token, bool userIsAdmin);
    }
}

