using System.Collections.Generic;

namespace API.Dtos
{
    public class PasswordChangeResponseDto
    {
        public IEnumerable<string> Errors { get; set; }
        public bool Succeeded { get; set; }
    }
}