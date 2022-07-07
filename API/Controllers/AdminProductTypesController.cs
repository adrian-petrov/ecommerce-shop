using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Authorisation;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminProductTypesController : BaseAdminController
    {
        private readonly IGenericRepository<ProductType> _productTypeRepository;
        private readonly IMapper _mapper;

        public AdminProductTypesController(
            IGenericRepository<ProductType> productTypeRepository,
            IMapper mapper)
        {
            _productTypeRepository = productTypeRepository;
            _mapper = mapper;
        }

        [HttpGet("types")]
        public async Task<ActionResult<AdminGetListResponseDto<ProductTypeResponseDto>>> GetList(
            AdminListQueryParams listQueryParams)
        {
            var productTypes = await _productTypeRepository.ListAllAsync();
            var dto = _mapper.Map<IReadOnlyList<ProductTypeResponseDto>>(productTypes);

            var response = new AdminGetListResponseDto<ProductTypeResponseDto>
            {
                Data = dto,
                Total = dto.Count
            };
            
            var from = listQueryParams.Range.First();
            var to = listQueryParams.Range.Last();
            
            Response.Headers.Add("Access-Control-Expose-Headers", "Content-Range");
            Response.Headers.Add("Content-Range", $"products {from}-{to}/{productTypes.Count}");
            
            return response;
        }

        [HttpGet("types/getmany")]
        public async Task<ActionResult<AdminManyResponseDto<ProductTypeResponseDto>>> GetMany(
            AdminManyQueryParams manyQueryParams)
        {
            var spec = new AdminProductTypesSpecification(manyQueryParams);
            var types = await _productTypeRepository.ListAsync(spec);

            return new AdminManyResponseDto<ProductTypeResponseDto>
            {
                Data = _mapper.Map<IReadOnlyList<ProductTypeResponseDto>>(types)
            };
        }
    }
}