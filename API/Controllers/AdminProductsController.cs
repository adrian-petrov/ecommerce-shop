using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using API.Authorisation;
using API.Configurations;
using API.Dtos;
using AutoMapper;
using Core.ElasticsearchModels;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdminProductsController : BaseAdminController
    {
        private readonly IGenericRepository<Product> _productRepository;
        private readonly IGenericRepository<ProductVariation> _productVariationRepository;
        private readonly IGenericRepository<ProductBrand> _productBrandRepository;
        private readonly IGenericRepository<ProductType> _productTypeRepository;
        private readonly IGenericRepository<Image> _imageRepository;
        private readonly IGenericRepository<Option> _optionRepository;
        private readonly IGenericRepository<ProductOption> _productOptionRepository;
        private readonly IElasticSearchService _elasticSearchService;
        private readonly BasePathOptions _basePathOptions;
        private readonly IMapper _mapper;

        public AdminProductsController(
            IGenericRepository<Product> productRepository,
            IGenericRepository<ProductVariation> productVariationRepository,
            IGenericRepository<ProductBrand> productBrandRepository,
            IGenericRepository<ProductType> productTypeRepository,
            IGenericRepository<Image> imageRepository,
            IGenericRepository<Option> optionRepository,
            IGenericRepository<ProductOption> productOptionRepository,
            IElasticSearchService elasticSearchService,
            IMapper mapper,
            IOptions<BasePathOptions> basePathOptions)
        {
            _productRepository = productRepository;
            _mapper = mapper;
            _productVariationRepository = productVariationRepository;
            _productBrandRepository = productBrandRepository;
            _productTypeRepository = productTypeRepository;
            _imageRepository = imageRepository;
            _optionRepository = optionRepository;
            _productOptionRepository = productOptionRepository;
            _elasticSearchService = elasticSearchService;
            _basePathOptions = basePathOptions.Value;
        }

        // PRODUCTS
        [HttpGet("products")]
        public async Task<ActionResult<AdminGetListResponseDto<AdminProductResponseDto>>> GetList(
            AdminListQueryParams queryParams)
        {
            var spec = new AdminProductSpecification(queryParams);
            var countSpec = new AdminProductCountSpecification(queryParams.Filter);

            var count = await _productRepository.CountAsync(countSpec);
            var products = await _productRepository.ListAsync(spec);
            var dto = _mapper.Map<IReadOnlyList<AdminProductResponseDto>>(products);

            var response = new AdminGetListResponseDto<AdminProductResponseDto>
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

        [HttpGet("products/{id:int}")]
        public async Task<ActionResult<AdminOneResponseDto<AdminProductResponseDto>>> GetOne(int id)
        {
            var spec = new AdminProductSpecification(id);

            var result = await _productRepository.FirstOrDefaultAsync(spec);

            return new AdminOneResponseDto<AdminProductResponseDto>
            {
                Data = _mapper.Map<AdminProductResponseDto>(result)
            };
        }

        [HttpPost("products")]
        public async Task<ActionResult<AdminOneResponseDto<AdminProductResponseDto>>> CreateOne(
            [FromBody] AdminProductRequestDto requestDto)
        {
            var productBrand = await _productBrandRepository.GetByIdAsync(requestDto.ProductBrandId);
            var productType = await _productTypeRepository.GetByIdAsync(requestDto.ProductTypeId);
            
            // create a new product w/o options and optionValues
            var newProduct = new Product
            {
                Name = requestDto.Name,
                Description = requestDto.Description,
                BasePrice = requestDto.BasePrice,
                Type = productType.Name,
                Brand = productBrand.Name,
                ProductTypeId = productType.Id,
                ProductBrandId = productBrand.Id,
            };

            newProduct = await _productRepository.AddAsync(newProduct);
            var productSpec = new AdminProductSpecification(newProduct.Id);
            newProduct = await _productRepository.FirstOrDefaultAsync(productSpec);
            
            // add productOptions & productOptionValues
            var options = await _optionRepository.ListAllAsync();
            
            foreach (var id in requestDto.ProductOptions)
            {
                var newProductOption = new ProductOption
                {
                    OptionId = id,
                    ProductId = newProduct.Id,
                    Name = options.FirstOrDefault(x => x.Id == id)?.Name,
                    ProductOptionValues = requestDto.ProductOptionValues
                        .Where(pov => pov.OptionId == id)
                        .Select(i => new ProductOptionValue
                        {
                            Name = i.Name,
                            OptionId = id,
                        }).ToList()
                };
                newProduct.ProductOptions.Add(newProductOption);
            }
            
            // add images
            foreach (var image in requestDto.Images)
            {
                var existingImage = await _imageRepository.GetByIdAsync(image.Id);
                existingImage.ProductId = newProduct.Id;
                await _imageRepository.UpdateAsync(existingImage);
            }
            

            await _productRepository.UpdateAsync(newProduct);
            
            // index the new product
            var elasticSearchProduct = _mapper.Map<ElasticSearchProduct>(newProduct);
            await _elasticSearchService.IndexProduct(elasticSearchProduct);
            
            return new AdminOneResponseDto<AdminProductResponseDto>
            {
                Data = _mapper.Map<AdminProductResponseDto>(newProduct)
            };
        }

        [HttpPut("products/{id:int}")]
        public async Task<ActionResult<AdminOneResponseDto<AdminProductResponseDto>>> UpdateOne(
            [FromBody] AdminProductRequestDto requestDto, int id)
        {
            var spec = new AdminProductSpecification(requestDto.Id);
            var existingProduct = await _productRepository.FirstOrDefaultAsync(spec);

            // update name
            existingProduct.Name = requestDto.Name;

            // update description
            existingProduct.Description = requestDto.Description;

            // update basePrice
            existingProduct.BasePrice = requestDto.BasePrice;

            // update brand
            var brand = await _productBrandRepository.GetByIdAsync(requestDto.ProductBrandId);
            existingProduct.ProductBrandId = requestDto.ProductBrandId;
            existingProduct.Brand = brand.Name;

            // update type
            var type = await _productTypeRepository.GetByIdAsync(requestDto.ProductTypeId);
            existingProduct.ProductTypeId = requestDto.ProductTypeId;
            existingProduct.Type = type.Name;

            // update productOptions
            var originalOptionsIds =
                existingProduct.ProductOptions
                    .Select(po => po.OptionId)
                    .ToList();
            var optionsToRemove = originalOptionsIds.Except(requestDto.ProductOptions).ToList();
            var optionsToAdd = requestDto.ProductOptions.Except(originalOptionsIds).ToList();

            // first remove the options which will also delete the related productOptionValues
            foreach (var productOption in existingProduct.ProductOptions)
                if (optionsToRemove.Contains(productOption.OptionId))
                    existingProduct.ProductOptions.Remove(productOption);

            // insert new options
            var insertedProductOptions = new List<ProductOption>();

            foreach (var optionId in optionsToAdd)
            {
                var newProductOption = new ProductOption
                {
                    ProductId = id,
                    OptionId = optionId,
                    Name = (await _optionRepository.GetByIdAsync(optionId)).Name
                };

                insertedProductOptions.Add(await _productOptionRepository.AddAsync(newProductOption));
            }

            // insert new productOptionValues for new productOptions
            foreach (var productOption in insertedProductOptions)
            {
                var newProductOptionValues =
                    requestDto.ProductOptionValues
                        .Where(pov => pov.Id == 0 && pov.OptionId == productOption.OptionId)
                        .Select(dto => dto);

                var productOptionSpec = new AdminProductOptionsWithProductOptionValuesSpecification(productOption.Id);
                var insertedProductOption = await _productOptionRepository.FirstOrDefaultAsync(productOptionSpec);

                foreach (var productOptionValue in newProductOptionValues)
                    insertedProductOption.ProductOptionValues.Add(new ProductOptionValue()
                    {
                        Name = productOptionValue.Name,
                        OptionId = productOption.OptionId,
                        ProductOptionId = insertedProductOption.Id
                    });
            }

            // insert and remove productOptionValues for existing productOptions
            var existingProductOptionValues =
                existingProduct.ProductOptions
                    .SelectMany(po => po.ProductOptionValues)
                    .Where(pov => pov.Id != 0) // to ignore newly added values in the previous section
                    .ToList();


            // 1. Insert new productOptionValues

            // we are making the comparison based on Name and OptionId only
            // because a newly selected optionValue checkbox won't have any reference
            // to a ProductOptionId nor will it have an Id of its own
            // example payload: { id: 0, name: 'XL', productOptionId: 0, optionId: 3 }
            var productOptionValuesToAdd =
                requestDto.ProductOptionValues
                    .Select(x => new { x.Name, x.OptionId })
                    .Except(existingProductOptionValues
                        .Select(y => new { y.Name, y.OptionId }));

            foreach (var productOptionValueToAdd in productOptionValuesToAdd)
            {
                // find the existing related productOption 
                var productOption = existingProduct.ProductOptions.FirstOrDefault(
                    x => x.OptionId == productOptionValueToAdd.OptionId);

                productOption?.ProductOptionValues.Add(new ProductOptionValue
                {
                    Name = productOptionValueToAdd.Name,
                    ProductOptionId = productOption.Id,
                    OptionId = productOptionValueToAdd.OptionId
                });
            }

            // 2. Remove productOptionValues
            var productOptionValuesToRemove =
                existingProductOptionValues
                    .Select(pov => new { pov.Name, pov.OptionId })
                    .Except(requestDto.ProductOptionValues
                        .Select(x => new { x.Name, x.OptionId })).ToList();

            foreach (var productOptionValueToRemove in productOptionValuesToRemove)
            {
                // find the existing related productOption 
                var productOption = existingProduct.ProductOptions
                    .FirstOrDefault(x => x.OptionId == productOptionValueToRemove.OptionId);
                var toRemove = productOption?.ProductOptionValues
                    .FirstOrDefault(pov => pov.Name == productOptionValueToRemove.Name);
                productOption?.ProductOptionValues.Remove(toRemove);
            }
            
            // Re-connect uploaded images to current product
            var disconnectedImagesIds = requestDto.Images
                .Where(i => i.ProductId == 0)
                .Select(i => i.Id);
            
            var imagesSpec = new AdminDisconnectedImages(disconnectedImagesIds);
            var disconnectedImages = await _imageRepository.ListAsync(imagesSpec);
            foreach (var image in disconnectedImages)
            {
                image.ProductId = id;
                await _imageRepository.UpdateAsync(image);
            }
            

            // finally remove existing images
            var imagesToBeRemovedIds = existingProduct.Images
                .Select(x => new { x.Id })
                .Except(requestDto.Images.Select(y => new { y.Id }));

            foreach (var imageToBeRemoved in imagesToBeRemovedIds)
            {
                var toRemove = existingProduct.Images.FirstOrDefault(i => i.Id == imageToBeRemoved.Id);
                existingProduct.Images.Remove(toRemove);
            }

            await _productRepository.UpdateAsync(existingProduct);

            return new AdminOneResponseDto<AdminProductResponseDto>
            {
                Data = _mapper.Map<AdminProductResponseDto>(existingProduct)
            };
        }

        [HttpPost("products/images")]
        public async Task<ActionResult<AdminGetListResponseDto<AdminImageResponseDto>>> UploadImages(
            IEnumerable<IFormFile> images)
        {
            var productsPath = _basePathOptions.ContentPath + "/images/products";
            var imagesToAdd = new List<Image>();
            var imagesToReturn = new List<Image>();

            foreach (var image in images)
            {
                var extension = Path.GetExtension(image.FileName);
                var newFileName = Path.GetRandomFileName() + extension;
                var fileNameWithPath = Path.Combine(productsPath, newFileName);

                await using (var stream = new FileStream(fileNameWithPath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                imagesToAdd.Add(new Image
                {
                    ImageUrl = $"images/products/{newFileName}",
                });
            }

            foreach (var image in imagesToAdd) imagesToReturn.Add(await _imageRepository.AddAsync(image));

            var response = new AdminGetListResponseDto<AdminImageResponseDto>
            {
                Data = _mapper.Map<List<AdminImageResponseDto>>(imagesToReturn),
                Total = imagesToReturn.Count
            };

            return StatusCode(StatusCodes.Status201Created, response);
        }

        [HttpDelete("products/{id:int}")]
        public async Task<ActionResult<AdminOneResponseDto<ProductResponseDto>>> DeleteOne(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            await _productRepository.DeleteAsync(product);
            
            // Remove prodcut from index
            var elasticSearchProduct = _mapper.Map<ElasticSearchProduct>(product);
            await _elasticSearchService.IndexProduct(elasticSearchProduct);

            var dto = _mapper.Map<ProductResponseDto>(product);

            var result = new AdminOneResponseDto<ProductResponseDto>
            {
                Data = dto
            };

            return result;
        }

        [HttpDelete("products")]
        public async Task<ActionResult<AdminManyResponseDto<int>>> DeleteMany(
            AdminManyQueryParams queryParams)
        {
            var ids = queryParams.Filter.FirstOrDefault().Value;
            var toDelete = new List<Product>();

            foreach (var id in ids) toDelete.Add(await _productRepository.GetByIdAsync(id));
            foreach (var entity in toDelete) await _productRepository.DeleteAsync(entity);

            var result = new AdminManyResponseDto<int> { Data = ids };
            return result;
        }
    }
}