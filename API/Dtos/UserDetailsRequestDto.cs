using System.ComponentModel.DataAnnotations;
using Core.Entities;

namespace API.Dtos
{
    public class UserDetailsRequestDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        public BillingAddress BillingAddress { get; set; }
    }
}