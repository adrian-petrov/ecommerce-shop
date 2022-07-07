using System.Collections.Generic;

namespace Core.Entities
{
    public class Option : BaseEntity
    {
        public string Name { get; set; }
        public ICollection<OptionValue> OptionValues { get; set; }
    }
}