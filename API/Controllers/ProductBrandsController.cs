using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductBrandsController : BaseApiController
    {
        private readonly IGenericRepository<ProductBrand> _productBrandRepository;
        private readonly IMapper _mapper;

        public ProductBrandsController(IGenericRepository<ProductBrand> productBrandRepository, IMapper mapper)
        {
            _productBrandRepository = productBrandRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductBrandResponseDto>>> GetProductBrands()
        {
            var brands = await _productBrandRepository.ListAllAsync();
            return Ok(_mapper.Map<IReadOnlyList<ProductBrandResponseDto>>(brands));
        }

        [HttpPost]
        public async Task<ActionResult<ProductBrandResponseDto>> CreateProductBrand(ProductBrandRequestDto requestDto)
        {
            var newProductBrand = new ProductBrand
            {
                Name = requestDto.Name
            };

            newProductBrand = await _productBrandRepository.AddAsync(newProductBrand);

            return Ok(_mapper.Map<ProductBrandResponseDto>(newProductBrand));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateProductBrand(ProductBrandRequestDto requestDto)
        {
            var currentProductBrand =
                await _productBrandRepository.GetByIdAsync(requestDto.Id);

            if (currentProductBrand == null)
                return NotFound();

            currentProductBrand.Name = requestDto.Name;
            await _productBrandRepository.UpdateAsync(currentProductBrand);

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> DeleteProductBrand(int id)
        {
            var productBrandToDelete = await _productBrandRepository.GetByIdAsync(id);
            
            if (productBrandToDelete == null)
                return NotFound();

            await _productBrandRepository.DeleteAsync(productBrandToDelete);

            return NoContent();
        }
    }
}