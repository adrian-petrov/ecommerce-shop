using System.Collections.Generic;

namespace API.Dtos
{
    public class OptionResponseDto
    {
        public string Name { get; set; }
        public IReadOnlyList<string> Values { get; set; }
    }
}