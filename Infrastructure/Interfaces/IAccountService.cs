using System.Threading.Tasks;
using Core.Entities;
using Core.Entities.Identity;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Interfaces
{
    public interface IAccountService
    {
        Task<AuthenticateResponse> AuthenticateAsync(
            AuthenticateRequest authenticateRequest, 
            bool fromAdminLogin,
            string ipAddress);
        // Task<Authent>
        Task<AuthenticateResponse> RegisterAccountAsync(
            RegisterRequest registerRequest,
            string ipAddress);
        Task<AuthenticateResponse> RefreshTokenAsync(string refreshToken, string ipAddress);
        Task RevokeTokenAsync(string token, string ipAddress);
        Task<AppUser> GetUserByUsernameAsync(string username);
        Task<AppUser> GetUserByRefreshTokenAsync(string token);
        Task UpdateBillingAddressAsync(string username, BillingAddress billingAddress);
        Task<string> UpdateEmailAddressAsync(string currentPassword, string newEmail);
        Task<IdentityResult> UpdatePasswordAsync(string email, string currentPassword, string newPassword);
        Task<AppUser> UpdateUserDetailsAsync(
            string username,
            string firstName,
            string lastName,
            BillingAddress billingAddress);
    }
}