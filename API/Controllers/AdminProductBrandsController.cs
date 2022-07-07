using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Dtos;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AdminProductBrandsController : BaseAdminController
    {
        private readonly IGenericRepository<ProductBrand> _productBrandRepository;
        private readonly IMapper _mapper;

        public AdminProductBrandsController(
            IGenericRepository<ProductBrand> productBrandRepository,
            IMapper mapper)
        {
            _productBrandRepository = productBrandRepository;
            _mapper = mapper;
        }

        [HttpGet("brands")]
        public async Task<ActionResult<AdminGetListResponseDto<ProductBrandResponseDto>>> GetList(
            AdminListQueryParams listQueryParams)
        {
            var brands = await _productBrandRepository.ListAllAsync();
            var dto = _mapper.Map<IReadOnlyList<ProductBrandResponseDto>>(brands);

            var response = new AdminGetListResponseDto<ProductBrandResponseDto>
            {
                Data = dto,
                Total = dto.Count
            };
            
            var from = listQueryParams.Range.First();
            var to = listQueryParams.Range.Last();
            
            Response.Headers.Add("Access-Control-Expose-Headers", "Content-Range");
            Response.Headers.Add("Content-Range", $"products {from}-{to}/{brands.Count}");
            
            return response;
        }
        
        [HttpGet("brands/getmany")]
        public async Task<ActionResult<AdminManyResponseDto<ProductBrandResponseDto>>> GetMany(
            AdminManyQueryParams manyQueryParams)
        {
            var spec = new AdminProductBrandsSpecification(manyQueryParams);
            var brands = await _productBrandRepository.ListAsync(spec);

            return new AdminManyResponseDto<ProductBrandResponseDto>
            {
                Data = _mapper.Map<IReadOnlyList<ProductBrandResponseDto>>(brands)
            };
        }
    }
}