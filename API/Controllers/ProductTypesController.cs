using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductTypesController : BaseApiController
    {
        private readonly IGenericRepository<ProductType> _productTypeRepository;
        private readonly IMapper _mapper;

        public ProductTypesController(IGenericRepository<ProductType> productTypeRepository, IMapper mapper)
        {
            _productTypeRepository = productTypeRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductTypeResponseDto>>> GetProductTypes()
        {
            var productTypes = await _productTypeRepository.ListAllAsync();
            return Ok(_mapper.Map<IReadOnlyList<ProductTypeResponseDto>>(productTypes));
        }

        [HttpPost]
        public async Task<ActionResult<ProductTypeResponseDto>> CreateProductType(ProductTypeRequestDto requestDto)
        {
            var newProductType = new ProductType
            {
                Name = requestDto.Name
            };

            newProductType = await _productTypeRepository.AddAsync(newProductType);

            return Ok(_mapper.Map<ProductTypeResponseDto>(newProductType));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateProductType(ProductTypeRequestDto requestDto)
        {
            var currentProductType = await _productTypeRepository.GetByIdAsync(requestDto.Id);

            if (currentProductType == null)
            {
                return NotFound();
            }

            currentProductType.Name = requestDto.Name;
            await _productTypeRepository.UpdateAsync(currentProductType);

            return NoContent();
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<ActionResult> DeleteProductType(int id)
        {
            var productTypeToDelete = await _productTypeRepository.GetByIdAsync(id);

            if (productTypeToDelete == null)
            {
                return NotFound();
            }

            await _productTypeRepository.DeleteAsync(productTypeToDelete);

            return NoContent();
        }
    }
}