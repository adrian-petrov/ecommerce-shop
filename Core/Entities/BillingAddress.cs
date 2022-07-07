using Core.Entities.Identity;

namespace Core.Entities
{
    public class BillingAddress : BaseEntity
    {
        public BillingAddress()
        {
        }

        public BillingAddress(
            string street1,
            string street2,
            string town, 
            string county, 
            string postcode)
        {
            Street1 = street1;
            Street2 = street2;
            Town = town;
            County = county;
            Postcode = postcode;
        }
        
        public string Street1 { get; set; }
        public string Street2 { get; set; }
        public string Town { get; set; }
        public string County { get; set; }
        public string Postcode { get; set; }
        public int AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}