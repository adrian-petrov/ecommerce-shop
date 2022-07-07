using System.Collections.Generic;

namespace API.Dtos
{
    public class AdminManyResponseDto<T>
    {
        public IReadOnlyList<T> Data { get; set; }
    }
}