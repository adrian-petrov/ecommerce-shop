namespace Core.Entities
{
    public class Image : BaseEntity
    {
        public string ImageUrl { get; set; }
        public int? ProductId { get; set; }
        public Product Product { get; set; }
    }
}