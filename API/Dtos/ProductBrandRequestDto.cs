using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class ProductBrandRequestDto
    {
        [Required] 
        public int Id { get; set; }
        [Required]
        [MaxLength(150)]
        public string Name { get; set; }
    }
}