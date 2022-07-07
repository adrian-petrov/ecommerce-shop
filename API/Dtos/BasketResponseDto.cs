using System.Collections.Generic;

namespace API.Dtos
{
    public class BasketResponseDto
    {
        public List<BasketItemResponseDto> Items { get; set; }
    }
}