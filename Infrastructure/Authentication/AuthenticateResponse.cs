using System.Text.Json.Serialization;
using Core.Entities.Identity;

namespace Infrastructure.Authentication
{
    public class AuthenticateResponse
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AccessToken { get; set; }
        [JsonIgnore]
        public string RefreshToken { get; set; }

        public AuthenticateResponse(AppUser appUser, string jwtToken, string refreshToken)
        {
            Email = appUser.Email;
            FirstName = appUser.FirstName;
            LastName = appUser.LastName;
            AccessToken = jwtToken;
            RefreshToken = refreshToken;
        }
    }
}
