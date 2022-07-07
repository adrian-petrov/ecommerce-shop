using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Core.Entities.OrderAggregate
{
    [NotMapped]
    public class Address
    {
        public Address()
        {
        }

        public Address(
            string firstName, 
            string lastName, 
            string street1,
            string street2,
            string town, 
            string county, 
            string postcode)
        {
            FirstName = firstName;
            LastName = lastName;
            Street1 = street1;
            Street2 = street2;
            Town = town;
            County = county;
            Postcode = postcode;
        }
        
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Street1 { get; set; }
        public string Street2 { get; set; }
        [Required]
        public string Town { get; set; }
        [Required]
        public string County { get; set; }
        [Required]
        public string Postcode { get; set; }
    }
}