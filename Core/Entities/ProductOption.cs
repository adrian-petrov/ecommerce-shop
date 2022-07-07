using System.Collections.Generic;

namespace Core.Entities
{
    public class ProductOption : BaseEntity
    {
        public string Name { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int OptionId { get; set; }
        public Option Option { get; set; }
        public ICollection<ProductOptionValue> ProductOptionValues { get; set; }
    }
}