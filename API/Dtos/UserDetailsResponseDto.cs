namespace API.Dtos
{
    public class UserDetailsResponseDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public BillingAddressResponseDto BillingAddress { get; set; }
    }
}