using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Core.Entities.Identity;
using Infrastructure.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure
{
    public class JwtUtils : IJwtUtils
    {
        private readonly IConfiguration _config;

        public JwtUtils(IConfiguration config)
        {
            _config = config;
        }

        public string GenerateJwtToken(List<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]));
            Console.WriteLine("========================================");
            Console.WriteLine($"The key is: {key}");
            Console.WriteLine("========================================");
            var adminClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.Role && c.Value == "Admin");
            var isAdmin = adminClaim != null;
            var issuer = isAdmin ? _config["Jwt:AdminIssuer"] : _config["Jwt:Issuer"];
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddMinutes(5),
                SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature),
                Issuer = issuer,
                Audience = issuer
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public RefreshToken GenerateRefreshToken(string ipAddress)
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[64];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(randomBytes),
                Expires = DateTime.UtcNow.AddDays(7),
                Created = DateTime.UtcNow,
                CreatedByIp = ipAddress
            };

            return refreshToken;
        }

        public string ValidateToken(string token, bool userIsAdmin)
        {
            if (token == null)
                return null;

            var key = Encoding.UTF8.GetBytes(_config["Jwt:Secret"]);
            var issuer = userIsAdmin ? _config["Jwt:AdminIssuer"] : _config["Jwt:Issuer"];
            
            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidIssuer = issuer,
                    ValidAudience = issuer,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ClockSkew = TimeSpan.Zero
                }, out var validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var username = jwtToken.Claims.First(x => x.Type == "name").Value;

                return username;
            }
            catch
            {
                return null;
            }
        }
        
    }
}