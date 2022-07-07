using System;
using System.Collections.Generic;
using System.Linq;

namespace Core.Entities
{
    public class ProductVariation : BaseEntity
    {
        public string Sku { get; set; }
        public string VariationString { get; set; }
        public decimal Price { get; set; }
        public int TotalStock { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public ProductVariationImage ProductVariationImage { get; set; }
        public ProductsStock ProductsStock { get; set; }
        public ICollection<BasketItem> BasketItems { get; set; }

        public void RemoveStock(int quantity)
        {
            TotalStock = Math.Max(TotalStock - quantity, 0);
            ProductsStock.TotalStock = Math.Max(TotalStock - quantity, 0);
        }

        public void UpdatePrice(decimal price)
        {
            Price = price;
            ProductsStock.UnitPrice = price;
        }

        public void RemoveOptionValuesStock(int quantity)
        {
            SetOptionValuesStock(-quantity);
        }

        public void UpdateStock(int quantity)
        {
            var stockDifference = quantity - TotalStock;

            TotalStock = Math.Max(quantity, 0);
            ProductsStock.TotalStock = Math.Max(quantity, 0);

            SetOptionValuesStock(stockDifference);
        }

        private void SetOptionValuesStock(int quantity)
        {
            var variationStringArray = VariationString.Split("_");
            
            switch (Product.Type)
                {
                    case "Trousers":
                    {
                        var lengthName = variationStringArray[^1];
                        var waistName = variationStringArray[^2];
                        var colourName = variationStringArray[^3];

                        var lengthOptionValue = Product.ProductOptions
                            .Where(po => po.Name == "Length")
                            .SelectMany(po => po.ProductOptionValues)
                            .FirstOrDefault(pov => pov.Name == lengthName);
                        
                        if (lengthOptionValue != null) 
                            lengthOptionValue.Stock = Math.Max(lengthOptionValue.Stock + quantity, 0);
                    
                        var waistOptionValue = Product.ProductOptions
                            .Where(po => po.Name == "Waist")
                            .SelectMany(po => po.ProductOptionValues)
                            .FirstOrDefault(pov => pov.Name == waistName);
                        
                        if (waistOptionValue != null)
                            waistOptionValue.Stock = Math.Max(waistOptionValue.Stock + quantity, 0);
                    
                        var colourOptionValue = Product.ProductOptions
                            .Where(po => po.Name == "Colour")
                            .SelectMany(po => po.ProductOptionValues)
                            .FirstOrDefault(pov => pov.Name == colourName);
                        
                        if (colourOptionValue != null)
                            colourOptionValue.Stock = Math.Max(colourOptionValue.Stock + quantity, 0);
                        break;
                    }
                    case "T-Shirts" or "Shoes":
                    {
                        var sizeName = variationStringArray[^1];
                        var colourName = variationStringArray[^2];
                    
                        var sizeOptionValue = Product.ProductOptions
                            .Where(po => po.Name == "Size")
                            .SelectMany(po => po.ProductOptionValues)
                            .FirstOrDefault(pov => pov.Name == sizeName);
                        
                        if (sizeOptionValue != null)
                            sizeOptionValue.Stock = Math.Max(sizeOptionValue.Stock + quantity, 0);
                    
                        var colourOptionValue = Product.ProductOptions
                            .Where(po => po.Name == "Colour")
                            .SelectMany(po => po.ProductOptionValues)
                            .FirstOrDefault(pov => pov.Name == colourName);
                        
                        if (colourOptionValue != null)
                            colourOptionValue.Stock = Math.Max(colourOptionValue.Stock + quantity, 0);
                        break;
                    }
                    case "Shorts":
                    {
                        var waistName = variationStringArray[^1];
                        var colourName = variationStringArray[^2];
                    
                        var waistOptionValue = Product.ProductOptions
                            .Where(po => po.Name == "Waist")
                            .SelectMany(po => po.ProductOptionValues)
                            .FirstOrDefault(pov => pov.Name == waistName);
                        
                        if (waistOptionValue != null)
                            waistOptionValue.Stock = Math.Max(waistOptionValue.Stock + quantity, 0);
                    
                        var colourOptionValue = Product.ProductOptions
                            .Where(po => po.Name == "Colour")
                            .SelectMany(po => po.ProductOptionValues)
                            .FirstOrDefault(pov => pov.Name == colourName);
                        
                        if (colourOptionValue != null)
                            colourOptionValue.Stock = Math.Max(colourOptionValue.Stock + quantity, 0);
                        break;
                    }
                    case "Hats":
                    {
                        var colourName = variationStringArray[^1];
                        
                        var colourOptionValue = Product.ProductOptions
                            .Where(po => po.Name == "Colour")
                            .SelectMany(po => po.ProductOptionValues)
                            .FirstOrDefault(pov => pov.Name == colourName);
                        
                        if (colourOptionValue != null)
                            colourOptionValue.Stock = Math.Max(colourOptionValue.Stock + quantity, 0);
                        break;
                    }
                }
        }
    }
}