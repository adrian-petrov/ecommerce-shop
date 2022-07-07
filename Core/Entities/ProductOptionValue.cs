using System.Collections.Generic;

namespace Core.Entities
{
    public class ProductOptionValue : BaseEntity
    {
        public string Name { get; set; }
        public int ProductOptionId { get; set; }
        public ProductOption ProductOption { get; set; }
        public int OptionId { get; set; }
        public Option Option { get; set; }
        public int Stock { get; set; }
    }
}