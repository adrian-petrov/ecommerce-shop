using System.Collections.Generic;

namespace Core.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal BasePrice { get; set; }
        public string Type { get; set; }
        public string Brand { get; set; }
        public int ProductTypeId { get; set; }
        public ProductType ProductType { get; set; }
        public int ProductBrandId { get; set; }
        public ProductBrand ProductBrand { get; set; }
        public ICollection<ProductVariation> ProductVariations { get; set; }
        public ICollection<ProductOption> ProductOptions { get; set; }
        public ICollection<Image> Images { get; set; }

        public void UpdateDetails(
            string name,
            string description)
        {
            if (!string.IsNullOrEmpty(name))
            {
                Name = name;
            }

            if (!string.IsNullOrEmpty(description))
            {
                Description = description;
            }
        }

        public void UpdateBrand(int id)
        {
            if (id != 0)
            {
                ProductBrandId = id;
            }
        }

        public void UpdateType(int id)
        {
            if (id != 0)
            {
                ProductTypeId = id;
            }
        }
    }
}