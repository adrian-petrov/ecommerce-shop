using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Core;
using Core.Entities;
using Core.Entities.Identity;
using Core.Exceptions;
using Infrastructure.Authentication;
using Infrastructure.Data;
using Infrastructure.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    public class AccountService : IAccountService   
    {
        private readonly IConfiguration _config;
        private readonly ShopContext _shopContext;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly IJwtUtils _jwtUtils;

        public AccountService(
            IConfiguration config, 
            ShopContext shopContext,
            SignInManager<AppUser> signInManager,
            UserManager<AppUser> userManager,
            IJwtUtils jwtUtils)
        {
            _config = config;
            _shopContext = shopContext;
            _signInManager = signInManager;
            _userManager = userManager;
            _jwtUtils = jwtUtils;
        }

        public async Task<AuthenticateResponse> AuthenticateAsync(
            AuthenticateRequest authenticateRequest, 
            bool fromAdminLogin,
            string ipAddress)
        {
            var user = await _shopContext
                .Users
                .Include(u => u.RefreshTokens)
                .Include(u => u.BillingAddress)
                .SingleOrDefaultAsync(x => x.UserName == authenticateRequest.Username);
            
            if (user == null)
                throw new UnauthorisedException("Username or password incorrect");

            var roles = await _userManager.GetRolesAsync(user);

            // Do not allow regular users to log into the admin page and viceversa
            switch (fromAdminLogin)
            {
                case true when !roles.Contains("Admin"):
                    throw new UnauthorisedException("Username or password incorrect");
                case false when roles.Contains("Admin"):
                    throw new UnauthorisedException("Username or password incorrect");
            }

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, authenticateRequest.Password, false);
            
            if (!signInResult.Succeeded)
                throw new UnauthorisedException("Username or password incorrect");

            // generate accessToken
            var claims = await GetClaimsFromUser(user);
            var jwtToken = _jwtUtils.GenerateJwtToken(claims);
            
            // generate refreshToken
            var refreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
            user.RefreshTokens.Add(refreshToken);

            RemoveOldRefreshTokens(user);

            await _userManager.UpdateAsync(user);

            return new AuthenticateResponse(user, jwtToken, refreshToken.Token);
        }

        public async Task<AuthenticateResponse> RegisterAccountAsync(RegisterRequest registerRequest, string ipAddress)
        {
            var user = await _userManager.FindByNameAsync(registerRequest.Email);
            if (user != null)
                throw new ApiException("Email already exists");

            var newUser = new AppUser
            {
                FirstName = registerRequest.FirstName,
                LastName = registerRequest.LastName,
                UserName = registerRequest.Email,
                Email = registerRequest.Email,
            };

            var result = await _userManager.CreateAsync(newUser, registerRequest.Password);

            if (!result.Succeeded)
                throw new ApiException("Something went wrong when creating this user");
            
            await _userManager.AddToRoleAsync(newUser, "Customer");
            
            var claims = await GetClaimsFromUser(newUser);
            var jwtToken = _jwtUtils.GenerateJwtToken(claims);
            
            // generate refreshToken
            var refreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
            newUser = await _shopContext.Users
                .Include(u => u.RefreshTokens)
                .FirstOrDefaultAsync(u => u.UserName == newUser.UserName);
            newUser.RefreshTokens.Add(refreshToken);

            await _userManager.UpdateAsync(newUser);

            return new AuthenticateResponse(newUser, jwtToken, refreshToken.Token);
        }

        public async Task<AuthenticateResponse> RefreshTokenAsync(string token, string ipAddress)
        {
            var user = await GetUserByRefreshTokenAsync(token);
            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);
            
            if (refreshToken.IsRevoked)
            {
                RevokeDescendantRefreshTokens(refreshToken, user, ipAddress, $"Attempted reuse of revoked ancestor token: {token}");
                _shopContext.Update(user);
                
                await _shopContext.SaveChangesAsync();
                throw new UnauthorisedException(Constants.RefreshTokenInvalid);
            }

            if (!refreshToken.IsActive)
                throw new UnauthorisedException(Constants.RefreshTokenInvalid);

            // replace old refresh token with a new one
            var newRefreshToken = RotateRefreshToken(refreshToken, ipAddress);
            user.RefreshTokens.Add(newRefreshToken);

            // remove old refresh tokens from user
            RemoveOldRefreshTokens(user);

            // save changes to db
            _shopContext.Update(user);
            await _shopContext.SaveChangesAsync();

            // generate new jwt
            var claims = await GetClaimsFromUser(user);
            var jwtToken = _jwtUtils.GenerateJwtToken(claims);

            return new AuthenticateResponse(user, jwtToken, newRefreshToken.Token);
        }
        
        public async Task RevokeTokenAsync(string token, string ipAddress)
        {
            var user = await GetUserByRefreshTokenAsync(token);
            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            if (!refreshToken.IsActive)
                throw new UnauthorisedException(Constants.RefreshTokenInvalid);

            RevokeRefreshToken(refreshToken, ipAddress, "Revoked without replacement");
            _shopContext.Update(user);
            await _shopContext.SaveChangesAsync();
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            var user = await _shopContext.Users
                .Include(u => u.BillingAddress)
                .FirstOrDefaultAsync(x => x.UserName == username);
            if (user == null)
                throw new KeyNotFoundException("User not found");

            return user;
        }
        
        public async Task<AppUser> GetUserByRefreshTokenAsync(string token)
        {
            var user = await _shopContext
                .Users
                .Include(u => u.RefreshTokens)
                .SingleOrDefaultAsync(x => x.RefreshTokens.Any(rt => rt.Token == token));
            
            if (user == null)
                throw new UnauthorisedException(Constants.RefreshTokenInvalid);
                
            return user;
        }

        public async Task UpdateBillingAddressAsync(string username, BillingAddress billingAddress)
        {
            var user = await _shopContext.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user == null)
                throw new KeyNotFoundException("User not found");
            
            user.BillingAddress = billingAddress;
            await _shopContext.SaveChangesAsync();
        }

        public async Task<AppUser> UpdateUserDetailsAsync(
            string username,
            string firstName,
            string lastName,
            BillingAddress billingAddress)
        {
            var user = await _shopContext.Users
                .Include(u => u.BillingAddress)
                .FirstOrDefaultAsync(x => x.UserName == username);
            
            if (user == null)
                throw new KeyNotFoundException("User not found");

            if (!string.IsNullOrEmpty(firstName))
            {
                user.FirstName = firstName;
            }

            if (!string.IsNullOrEmpty(lastName))
            {
                user.LastName = lastName;
            }

            if (billingAddress != null)
            {
                user.BillingAddress = billingAddress;
            }

            await _shopContext.SaveChangesAsync();

            return user;
        }

        public async Task<string> UpdateEmailAddressAsync(string existingEmail, string newEmail)
        {
            if (_shopContext.Users.Any(u => u.Email == newEmail))
                throw new DuplicateNameException("Email already in use");
            
            var user = await _shopContext.Users.FirstOrDefaultAsync(x => x.Email == existingEmail);
            if (user == null)
                throw new KeyNotFoundException("User not found");
            
            user.Email = newEmail;
            user.NormalizedEmail = newEmail.ToUpper();
            user.UserName = newEmail;
            user.NormalizedUserName = newEmail.ToUpper();
            
            await _shopContext.SaveChangesAsync();
            
            return newEmail;
        }

        public async Task<IdentityResult> UpdatePasswordAsync(string email, string currentPassword, string newPassword)
        {
            var user = await _userManager.FindByNameAsync(email);
            var result = await _userManager.ChangePasswordAsync(user, currentPassword, newPassword);
            return result;
        }
        
        private async Task<List<Claim>> GetClaimsFromUser(AppUser user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.Name, user.Email),
                new("id", user.Id.ToString())
            };
            
            var roles = await _userManager.GetRolesAsync(user);

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
            
            return claims;
        }

        private void RevokeDescendantRefreshTokens(
            RefreshToken token, 
            AppUser user, 
            string ipAddress,
            string reason)
        {
            if (string.IsNullOrEmpty(token.ReplacedByToken)) return;
            
            var childToken = user.RefreshTokens.SingleOrDefault(x => x.Token == token.ReplacedByToken);
            if (childToken != null && childToken.IsActive)
                RevokeRefreshToken(childToken, ipAddress, reason);
            else
                RevokeDescendantRefreshTokens(childToken, user, ipAddress, reason);
        }

        private void RevokeRefreshToken(
            RefreshToken token,
            string ipAddress,
            string reason = null,
            string replacedByToken = null)
        {
            token.Revoked = DateTime.UtcNow;
            token.RevokedByIp = ipAddress;
            token.ReasonRevoked = reason;
            token.ReplacedByToken = replacedByToken;
        }
        
        private void RemoveOldRefreshTokens(AppUser user)
        {
            user.RefreshTokens.RemoveAll(x =>
                !x.IsActive || x.Created.AddDays(Convert.ToDouble(_config["Jwt:RefreshTokenTTL"])) <= DateTime.UtcNow);
        }

        private RefreshToken RotateRefreshToken(RefreshToken token, string ipAddress)
        {
            var newRefreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
            RevokeRefreshToken(token, ipAddress, "Replaced by new token", newRefreshToken.Token);
            return newRefreshToken;
        }
    }
}