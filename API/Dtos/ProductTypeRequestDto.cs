using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class ProductTypeRequestDto
    {
        [Required] 
        public int Id { get; set; }
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }
    }
}