using System;
using System.Text.Json.Serialization;

namespace Core.Entities
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        [JsonIgnore]
        public DateTime? CreatedAt { get; set; }
        [JsonIgnore]
        public DateTime? UpdatedAt { get; set; }
    }
}