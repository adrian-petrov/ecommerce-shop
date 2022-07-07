using Core.Entities;
using Core.Entities.OrderAggregate;

namespace API.Dtos
{
    public class UserResponseDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string AccessToken { get; set; }
    }
}