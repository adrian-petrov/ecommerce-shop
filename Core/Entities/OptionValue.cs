namespace Core.Entities
{
    public class OptionValue : BaseEntity
    {
        public string Name { get; set; }
        public int OptionId { get; set; }
        public Option Option { get; set; }
    }
}