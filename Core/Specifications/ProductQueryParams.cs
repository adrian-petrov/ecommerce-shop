using System.Collections.Generic;

namespace Core.Specifications
{
    public class ProductQueryParams
    {
        private const int MaxPageSize = 30;
        private int _pageSize = 6;
        private string _search;

        public int PageIndex { get; set; } = 1;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        
        public string[] Types { get; set; }
        public string[] Brands { get; set; }
        public string[] Genders { get; set; }
        public string[] Colours { get; set; }
        public string[] Sizes { get; set; }
        public string[] Waists { get; set; }
        public string[] Lengths { get; set; }
        
        public string Sort { get; set; }
        public string Search
        {
            get => _search;
            set => _search = value.ToLower();
        }
    }
}