using System.Collections.Generic;

namespace API.Dtos
{
    public class AdminProductOptionResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OptionId { get; set; }
        public IReadOnlyList<AdminProductOptionValueResponseDto> ProductOptionValues { get; set; }
    }
}