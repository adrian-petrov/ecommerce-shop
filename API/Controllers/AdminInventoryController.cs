using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
    public class AdminInventoryController : BaseAdminController
    {
        private readonly IGenericRepository<ProductVariation> _productVariationRepository;
        private readonly IGenericRepository<Product> _productRepository;
        private readonly IGenericRepository<ProductOptionValue> _productOptionValueRepository;
        private readonly IMapper _mapper;

        public AdminInventoryController(
            IGenericRepository<ProductVariation> productVariationRepository,
            IGenericRepository<Product> productRepository,
            IGenericRepository<ProductOptionValue> productOptionValueRepository,
            IMapper mapper)
        {
            _productVariationRepository = productVariationRepository;
            _productRepository = productRepository;
            _productOptionValueRepository = productOptionValueRepository;
            _mapper = mapper;
        }

        [HttpGet("inventory")]
        public async Task<ActionResult<AdminGetListResponseDto<AdminProductVariationResponseDto>>> GetList(
            AdminListQueryParams queryParams)
        {
            var spec = new AdminProductVariationSpecification(queryParams);
            var countSpec = new AdminProductVariationCountSpecification(queryParams.Filter);

            var productVariations = await _productVariationRepository.ListAsync(spec);
            var count = await _productVariationRepository.CountAsync(countSpec);
            var dto = _mapper.Map<IReadOnlyList<AdminProductVariationResponseDto>>(productVariations);

            var response = new AdminGetListResponseDto<AdminProductVariationResponseDto>
            {
                Data = dto,
                Total = count
            };

            var from = queryParams.Range.First();
            var to = queryParams.Range.Last();

            Response.Headers.Add("Access-Control-Expose-Headers", "Content-Range");
            Response.Headers.Add("Content-Range", $"products {from}-{to}/{count}");

            return response;
        }

        [HttpGet("inventory/{id:int}")]
        public async Task<ActionResult<AdminOneResponseDto<AdminProductVariationResponseDto>>> GetOne(int id)
        {
            var spec = new AdminProductVariationSpecification(id);
            var productVariation = await _productVariationRepository.FirstOrDefaultAsync(spec);

            return new AdminOneResponseDto<AdminProductVariationResponseDto>
            {
                Data = _mapper.Map<AdminProductVariationResponseDto>(productVariation)
            };
        }

        [HttpPut("inventory/{id:int}")]
        public async Task<ActionResult<AdminOneResponseDto<AdminProductVariationResponseDto>>> UpdateOne(
            AdminProductVariationRequestDto requestDto, int id)
        {
            var spec = new AdminProductVariationSpecification(id);
            var productVariation = await _productVariationRepository.FirstOrDefaultAsync(spec);

            productVariation.UpdateStock(requestDto.TotalStock);
            productVariation.UpdatePrice(requestDto.Price);
            await _productVariationRepository.UpdateAsync(productVariation);

            var productSpec = new AdminProductSpecification(requestDto.ProductId);
            var product = await _productRepository.FirstOrDefaultAsync(productSpec); 

            // Update optionValues stock
            var colour = product.ProductOptions
                .Where(po => po.Name == "Colour")
                .SelectMany(po => po.ProductOptionValues)
                .FirstOrDefault(pov => pov.Id == requestDto.Colour);
            if (colour != null)
                colour.Stock += requestDto.TotalStock;
            
            switch (product.Type)
            {
                case "T-Shirts" or "Shoes":
                    var size = product.ProductOptions
                        .Where(po => po.Name == "Size")
                        .SelectMany(po => po.ProductOptionValues)
                        .FirstOrDefault(pov => pov.Id == requestDto.Size);

                    if (size != null)
                    {
                        size.Stock += requestDto.TotalStock;
                    }
                    break;
                case "Shorts":
                    var waistShorts = product.ProductOptions
                        .Where(po => po.Name == "Waist")
                        .SelectMany(po => po.ProductOptionValues)
                        .FirstOrDefault(pov => pov.Id == requestDto.Waist);
                    
                    if (waistShorts != null) 
                        waistShorts.Stock += requestDto.TotalStock;
                    break;
                case "Trousers":
                    var waistTrousers = product.ProductOptions
                        .Where(po => po.Name == "Waist")
                        .SelectMany(po => po.ProductOptionValues)
                        .FirstOrDefault(pov => pov.Id == requestDto.Waist);
                    var length = product.ProductOptions
                        .Where(po => po.Name == "Length")
                        .SelectMany(po => po.ProductOptionValues)
                        .FirstOrDefault(pov => pov.Id == requestDto.Length);

                    if (waistTrousers != null && length != null)
                    {
                        waistTrousers.Stock += requestDto.TotalStock;
                        length.Stock += requestDto.TotalStock;
                    }
                    break;
            }

            await _productRepository.UpdateAsync(product);


            return new AdminOneResponseDto<AdminProductVariationResponseDto>
            {
                Data = _mapper.Map<AdminProductVariationResponseDto>(productVariation)
            };
        }

        [HttpDelete("inventory/{id:int}")]
        public async Task<ActionResult<AdminOneResponseDto<AdminProductVariationResponseDto>>> DeleteOne(
            int id)
        {
            var entity = await _productVariationRepository.GetByIdAsync(id);
            await _productVariationRepository.DeleteAsync(entity);

            var dto = _mapper.Map<AdminProductVariationResponseDto>(entity);
            
            return new AdminOneResponseDto<AdminProductVariationResponseDto>
            {
                Data = _mapper.Map<AdminProductVariationResponseDto>(dto)
            };
        }
        
        [HttpDelete("inventory")]
        public async Task<ActionResult<AdminManyResponseDto<int>>> DeleteMany(
            AdminManyQueryParams queryParams)
        {
            var ids = queryParams.Filter.FirstOrDefault().Value;
            var toDelete = new List<ProductVariation>();

            foreach (var id in ids) toDelete.Add(await _productVariationRepository.GetByIdAsync(id));
            foreach (var entity in toDelete) await _productVariationRepository.DeleteAsync(entity);

            var result = new AdminManyResponseDto<int> { Data = ids };
            return result;
        }
        

        [HttpPost("inventory")]
        public async Task<ActionResult<AdminOneResponseDto<AdminProductVariationResponseDto>>> CreateOne(
            [FromBody] AdminProductVariationRequestDto requestDto)
        {
            var spec = new AdminProductSpecification(requestDto.ProductId);
            var product = await _productRepository.FirstOrDefaultAsync(spec);
            var image = product.Images.FirstOrDefault(i => i.Id == requestDto.Image);
            var gender = product.ProductOptions
                .Where(po => po.Name == "Gender")
                .SelectMany(po => po.ProductOptionValues)
                .FirstOrDefault(pov => pov.Id == requestDto.Gender);
            var colour = product.ProductOptions
                .Where(po => po.Name == "Colour")
                .SelectMany(po => po.ProductOptionValues)
                .FirstOrDefault(pov => pov.Id == requestDto.Colour);
            var size = product.ProductOptions
                .Where(po => po.Name == "Size")
                .SelectMany(po => po.ProductOptionValues)
                .FirstOrDefault(pov => pov.Id == requestDto.Size);
            var waist = product.ProductOptions
                .Where(po => po.Name == "Waist")
                .SelectMany(po => po.ProductOptionValues)
                .FirstOrDefault(pov => pov.Id == requestDto.Waist);
            var length = product.ProductOptions
                .Where(po => po.Name == "Length")
                .SelectMany(po => po.ProductOptionValues)
                .FirstOrDefault(pov => pov.Id == requestDto.Length);

            var (item1, item2) = GenerateSkuAndVariationString(
                requestDto,
                product.Brand,
                product.Type,
                gender?.Name,
                colour?.Name.Replace(" ", ""),
                size?.Name,
                waist?.Name,
                length?.Name);

            // Update optionValues stock
            switch (product.Type)
            {
                case "T-Shirts" or "Shoes":
                    colour!.Stock = requestDto.TotalStock;
                    size!.Stock = requestDto.TotalStock;
                    break;
                case "Hats":
                    colour!.Stock = requestDto.TotalStock;
                    break;
                case "Shorts":
                    colour!.Stock = requestDto.TotalStock;
                    waist!.Stock = requestDto.TotalStock;
                    break;
                case "Trousers":
                    colour!.Stock = requestDto.TotalStock;
                    waist!.Stock = requestDto.TotalStock;
                    length!.Stock = requestDto.TotalStock;
                    break;
            }

            await _productRepository.UpdateAsync(product);

            var newProductVariation = new ProductVariation
            {
                Sku = item1,
                VariationString = item2,
                Price = requestDto.Price,
                TotalStock = requestDto.TotalStock,
                ProductId = requestDto.ProductId,
                ProductVariationImage = new ProductVariationImage
                {
                    ImageUrl = image!.ImageUrl
                },
                ProductsStock = new ProductsStock
                {
                    TotalStock = requestDto.TotalStock,
                    UnitPrice = requestDto.Price
                }
            };

            newProductVariation = await _productVariationRepository.AddAsync(newProductVariation);

            return new AdminOneResponseDto<AdminProductVariationResponseDto>
            {
                Data = _mapper.Map<AdminProductVariationResponseDto>(newProductVariation)
            };
        }


        private Tuple<string, string> GenerateSkuAndVariationString(
            AdminProductVariationRequestDto requestDto,
            string productBrand,
            string productType,
            string gender,
            string colour,
            string size,
            string waist,
            string length)
        {
            // sku - 1_Jup_Tro_Men_Den_28_26  
            // variationString - Jupiter_Trousers_Mens_Denim_28_28      
            var skuStringBuilder = new StringBuilder();
            var variationStringBuilder = new StringBuilder();

            skuStringBuilder
                .Append(requestDto.ProductId)
                .Append('_')
                .Append(productBrand[..3])
                .Append('_')
                .Append(productType[..3])
                .Append('_')
                .Append(gender[..3])
                .Append('_')
                .Append(colour[..3])
                .Append('_');
            if (!string.IsNullOrEmpty(size))
                skuStringBuilder.Append(size.Length > 2 ? size[..3] : size);
            if (!string.IsNullOrEmpty(waist))
                skuStringBuilder.Append(waist.Length > 2 ? waist[..3] : waist);
            if (!string.IsNullOrEmpty(length))
                skuStringBuilder.Append('_').Append(length.Length > 2 ? length[..3] : length);

            variationStringBuilder
                .Append(productBrand)
                .Append('_')
                .Append(productType)
                .Append('_')
                .Append(gender)
                .Append('_')
                .Append(colour)
                .Append('_');
            if (!string.IsNullOrEmpty(size))
                variationStringBuilder.Append(size);
            if (!string.IsNullOrEmpty(waist))
                variationStringBuilder.Append(waist);
            if (!string.IsNullOrEmpty(length))
                variationStringBuilder.Append('_').Append(length);

            var tuple = Tuple.Create(skuStringBuilder.ToString(), variationStringBuilder.ToString());
            return tuple;
        }
    }
}