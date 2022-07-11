namespace Infrastructure.Configurations
{
    public class JwtOptions
    {
        public const string Jwt = "Jwt";
        
        public string Issuer { get; set; }
        public string AdminIssuer { get; set; }
        public string Secret { get; set; }
        public int RefreshTokenTtl { get; set; }
    }
}