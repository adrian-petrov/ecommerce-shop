using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly IGenericRepository<Product> _productRepository;
        private readonly IGenericRepository<Option> _optionRepository;
        private readonly IGenericRepository<ProductType> _productTypeRepository;
        private readonly IGenericRepository<ProductBrand> _productBrandRepository;

        public ProductsController(
            IConfiguration config,
            IMapper mapper,
            IGenericRepository<Product> productRepository,
            IGenericRepository<Option> optionRepository,
            IGenericRepository<ProductType> productTypeRepository,
            IGenericRepository<ProductBrand> productBrandRepository)
        {
            _config = config;
            _mapper = mapper;
            _productRepository = productRepository;
            _optionRepository = optionRepository;
            _productTypeRepository = productTypeRepository;
            _productBrandRepository = productBrandRepository;
        }

        [HttpGet]
        public async Task<ActionResult<Pagination<ProductResponseDto>>> GetProducts(
            [FromQuery] ProductQueryParams productQueryParams)
        {
            var spec = new ProductFilterPaginatedSpecification(productQueryParams);
            var countSpec = new ProductFilterPaginatedCountSpecification(productQueryParams);

            var count = await _productRepository.CountAsync(countSpec);
            var products = await _productRepository.ListAsync(spec);

            var dto = _mapper.Map<IReadOnlyList<ProductResponseDto>>(products);

            var response = new Pagination<ProductResponseDto>(
                productQueryParams.PageIndex,
                productQueryParams.PageSize,
                count,
                dto);

            return Ok(response);
        }
        
        [HttpGet]
        [Route("{id:int}")]
        public async Task<ActionResult<ProductResponseDto>> GetProduct(int id)
        {
            var spec = new ProductSpecification(id);
            var product = await _productRepository.FirstOrDefaultAsync(spec);

            if (product == null)
                return NotFound();

            var response = _mapper.Map<ProductResponseDto>(product);
            return response;
        }

        [HttpGet]
        [Route("men/{type}")]
        public async Task<ActionResult<Pagination<ProductResponseDto>>> GetMensProductsByType(
            [FromQuery] ProductQueryParams productQueryParams, string type)
        {
            var spec = new ProductPaginatedSpecification(type, "mens", productQueryParams);
            var products = await _productRepository.ListAsync(spec);

            var dto = _mapper.Map<IReadOnlyList<ProductResponseDto>>(products);
            
            var response = new Pagination<ProductResponseDto>(
                productQueryParams.PageIndex,
                productQueryParams.PageSize,
                products.Count,
                dto);

            return Ok(response);
        }
        
        [HttpGet]
        [Route("women/{type}")]
        public async Task<ActionResult<Pagination<ProductResponseDto>>> GetWomensProductsByType(
            [FromQuery] ProductQueryParams productQueryParams, string type)
        {
            var spec = new ProductPaginatedSpecification(type, "womens", productQueryParams);
            var products = await _productRepository.ListAsync(spec);

            var dto = _mapper.Map<IReadOnlyList<ProductResponseDto>>(products);
            
            var response = new Pagination<ProductResponseDto>(
                productQueryParams.PageIndex,
                productQueryParams.PageSize,
                products.Count,
                dto);

            return Ok(response);
        }

        [HttpGet]
        [Route("filters")]
        public async Task<ActionResult<FilterResponseDto>> GetProductFilters()
        {
            var types = await _productTypeRepository.ListAllAsync();
            var brands = await _productBrandRepository.ListAllAsync();
            var spec = new OptionWithValuesSpecification();
            var options = await _optionRepository.ListAsync(spec);

            var dto = new FilterResponseDto
            {
                Types = _mapper.Map<IReadOnlyList<ProductTypeResponseDto>>(types),
                Brands = _mapper.Map<IReadOnlyList<ProductBrandResponseDto>>(brands),
                Options = _mapper.Map<IReadOnlyList<OptionResponseDto>>(options),
                SortOptions = new List<string> { "nameAsc", "nameDesc", "priceAsc", "priceDesc" }
            };
            return Ok(dto);
        }
    }
}