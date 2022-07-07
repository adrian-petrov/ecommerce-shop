using System.Collections.Generic;
using System.Linq;
using Ardalis.Specification;
using Core.Entities;
using Infrastructure.Extensions;

namespace Core.Specifications
{
    public sealed class ProductFilterPaginatedCountSpecification : Specification<Product>
    {
        public ProductFilterPaginatedCountSpecification(ProductQueryParams productQueryParams)
        {
            // Product Types
            if (!productQueryParams.Types.IsNullOrEmpty())
            {
                Query.Where(p => productQueryParams.Types.Contains(p.Type));
            }
            
            // Product Brands
            if (!productQueryParams.Brands.IsNullOrEmpty())
            {
                Query.Where(p => productQueryParams.Brands.Contains(p.Brand));
            }
            
            // Genders
            if (!productQueryParams.Genders.IsNullOrEmpty())
            {
                Query
                    .Where(p => p.ProductOptions.Where(po => po.Name == "Gender")
                        .Any(po => po.ProductOptionValues
                            .Any(pov => productQueryParams.Genders.Contains(pov.Name))));
            }
            
            // Colours
            if (!productQueryParams.Colours.IsNullOrEmpty())
            {
                Query
                    .Where(p => p.ProductOptions.Where(po => po.Name == "Colour")
                        .Any(po => po.ProductOptionValues
                            .Any(pov => productQueryParams.Colours.Contains(pov.Name))));
            }
            
            // Sizes
            if (!productQueryParams.Sizes.IsNullOrEmpty())
            {
                Query
                    .Where(p => p.ProductOptions.Where(po => po.Name == "Size")
                        .Any(po => po.ProductOptionValues
                            .Any(pov => productQueryParams.Sizes.Contains(pov.Name))));
            }
            
            // Waists
            if (!productQueryParams.Waists.IsNullOrEmpty())
            {
                Query
                    .Where(p => p.ProductOptions.Where(po => po.Name == "Waist")
                        .Any(po => po.ProductOptionValues
                            .Any(pov => productQueryParams.Waists.Contains(pov.Name))));
            }
            
            // Lengths
            if (!productQueryParams.Lengths.IsNullOrEmpty())
            {
                Query
                    .Where(p => p.ProductOptions.Where(po => po.Name == "Length")
                        .Any(po => po.ProductOptionValues
                            .Any(pov => productQueryParams.Lengths.Contains(pov.Name))));
            }
            
            Query.Where(p => p.ProductVariations.Any());
        }
    }
}