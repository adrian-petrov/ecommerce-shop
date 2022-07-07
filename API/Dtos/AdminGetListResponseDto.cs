using System.Collections.Generic;
using Core.Entities;

namespace API.Dtos
{
    public class AdminGetListResponseDto<T>
    {
        public IReadOnlyList<T> Data { get; set; }
        public int Total { get; set; }
    }
}