namespace Core.ElasticsearchModels
{
    public class ElasticSearchProduct
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Brand { get; set; }
        public decimal BasePrice { get; set; }
        public string ImageUrl { get; set; }
    }
}