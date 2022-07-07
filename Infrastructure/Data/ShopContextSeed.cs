using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Ardalis.Specification.EntityFrameworkCore;
using Core.Entities;
using Core.Entities.Identity;
using Core.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Data
{
    public class ShopContextSeed
    {
        public static async Task SeedShopDataAsync(
            ShopContext context, 
            ILoggerFactory loggerFactory,
            string seedDataPath,
            string contentPath)
        {
            try
            {
                // DeliveryMethods
                if (!await context.DeliveryMethods.AnyAsync())
                    await SaveDataAsync<DeliveryMethod>(Path.Combine(seedDataPath, "DeliveryMethods.json"), context);

                // ProductBrands
                if (!await context.ProductBrands.AnyAsync())
                    await SaveDataAsync<ProductBrand>(Path.Combine(seedDataPath, "ProductBrands.json"), context);

                // ProductTypes
                if (!await context.ProductTypes.AnyAsync())
                    await SaveDataAsync<ProductType>(Path.Combine(seedDataPath, "ProductTypes.json"), context);

                // Products
                if (!await context.Products.AnyAsync())
                    await SaveDataAsync<Product>(Path.Combine(seedDataPath, "Products.json"), context);

                // Options
                if (!await context.Options.AnyAsync())
                    await SaveDataAsync<Option>(Path.Combine(seedDataPath, "Options.json"), context);

                // OptionValues
                if (!await context.OptionValues.AnyAsync())
                    await SaveDataAsync<OptionValue>(Path.Combine(seedDataPath, "OptionValues.json"), context);

                // ProductOptions
                if (!await context.ProductOptions.AnyAsync())
                    await SaveDataAsync<ProductOption>(Path.Combine(seedDataPath, "ProductOptions.json"), context);

                // ProductOptionValues
                if (!await context.ProductOptionValues.AnyAsync())
                    await SaveDataAsync<ProductOptionValue>(Path.Combine(seedDataPath, "ProductOptionValues.json"),
                        context);

                // ProductVariations
                if (!await context.ProductVariations.AnyAsync())
                    await SeedProductVariationsData(context, seedDataPath, contentPath);
                
                // Images
                if (!await context.Images.AnyAsync())
                    await SaveDataAsync<Image>(Path.Combine(seedDataPath, "Images.json"),
                        context);
            }
            catch (Exception e)
            {
                var logger = loggerFactory.CreateLogger<ShopContextSeed>();
                logger.LogError(e.Message);
            }
        }

        public static async Task SeedRolesAndDefaultUsers(
            UserManager<AppUser> userManager,
            RoleManager<AppRole> roleManager)
        {
            string[] roleNames = { "Admin", "Customer" };

            // 1. Create the roles
            foreach (var roleName in roleNames)
            {
                var roleExists = await roleManager.RoleExistsAsync(roleName);

                if (!roleExists)
                    await roleManager.CreateAsync(new AppRole(roleName));
            }

            // 2. Create the default Admin user
            var adminUser = await userManager.FindByEmailAsync("admin@ecommerce-shop.com");
            if (adminUser == null)
            {
                adminUser = new AppUser
                {
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@ecommerce-shop.com",
                    UserName = "admin@ecommerce-shop.com"
                };

                var createdUser = await userManager.CreateAsync(adminUser, "adminpassword");

                if (createdUser.Succeeded)
                    await userManager.AddToRoleAsync(adminUser, "Admin");
            }

            // 3. Create the default Customer user
            var customerUser = await userManager.FindByEmailAsync("customer@ecommerce-shop.com");
            if (customerUser == null)
            {
                customerUser = new AppUser
                {
                    FirstName = "Customer",
                    LastName = "User",
                    Email = "customer@ecommerce-shop.com",
                    UserName = "customer@ecommerce-shop.com"
                };

                var createdUser = await userManager.CreateAsync(customerUser, "customerpassword");

                if (createdUser.Succeeded)
                    await userManager.AddToRoleAsync(customerUser, "Customer");
            }
        }

        private static async Task SaveDataAsync<T>(
            string path,
            ShopContext context) where T : BaseEntity
        {
            var jsonData = await File.ReadAllTextAsync(path);
            var data = JsonSerializer.Deserialize<List<T>>(jsonData);

            foreach (var item in data) await context.Set<T>().AddAsync(item);
            await context.SaveChangesAsync();
        }

        private static async Task SeedProductVariationsData(
            ShopContext context, 
            string seedDataPath, 
            string contentPath)
        {
            var productsJson = await File.ReadAllTextAsync(Path.Combine(seedDataPath, "Products.json"));
            var productsData = JsonSerializer.Deserialize<List<Product>>(productsJson);

            var productOptionsJson = await File.ReadAllTextAsync(Path.Combine(seedDataPath, "ProductOptions.json"));
            var productOptionsData = JsonSerializer.Deserialize<List<ProductOption>>(productOptionsJson);

            var productOptionValuesJson = await File.ReadAllTextAsync(Path.Combine(seedDataPath,
                "ProductOptionValues.json"));
            var productOptionValuesData = JsonSerializer.Deserialize<List<ProductOptionValue>>(productOptionValuesJson);

            var variationsSets = CreateProductVariationsSets(
                productsData,
                productOptionsData,
                productOptionValuesData);

            var productVariations =
                variationsSets // [ [[], [], []], ... ]
                    .Cast<IEnumerable<IEnumerable<string>>>()
                    .SelectMany(CartesianProduct).ToList();
            var products = await context.Products.ToListAsync();

            var id = 1;
            var price = 0.0M;
            var totalStock = 1;
            foreach (var productVariation in productVariations)
            {
                var productVariationList = productVariation.ToList();
                var productId = int.Parse(productVariationList[0]);
                var currentProduct = products.Find(p => p.Id == productId);
                if (currentProduct != null)
                    price = currentProduct.BasePrice;

                // Remove the Id from the list as it is not needed in the VariationString
                productVariationList.RemoveAt(0);

                var stringsWithWhitespaceRemoved =
                    productVariationList.Select(x => Regex.Replace(x, @"\s", string.Empty)).ToList();
                var variationString = string.Join("_", stringsWithWhitespaceRemoved);

                var stringsWithDotsAndWhitespaceRemoved =
                    stringsWithWhitespaceRemoved.Select(x => Regex.Replace(x, @"\.", string.Empty));
                var shortenedSkuString = string.Join("_",
                    stringsWithDotsAndWhitespaceRemoved.Select(x => x.Length > 2 ? x[..3] : x));
                var sku = string.Join("_", productId.ToString(), shortenedSkuString);

                // insert new ProductVariation
                var newProductVariation = new ProductVariation
                {
                    Id = id,
                    Sku = sku,
                    VariationString = variationString,
                    Price = price,
                    TotalStock = totalStock,
                    ProductId = productId
                };
                await context.ProductVariations.AddAsync(newProductVariation);

                // insert new ProductsStock
                var newProductsStock = new ProductsStock
                {
                    Id = id,
                    TotalStock = totalStock,
                    UnitPrice = price,
                    ProductVariationId = id
                };
                await context.ProductsStock.AddAsync(newProductsStock);
                id++;
            }

            await context.SaveChangesAsync();

            // insert new ProductVariationImage
            var productImagesPaths =
                Directory
                    .GetFiles(Path.Combine(contentPath, "images/products"))
                    .Select(Path.GetFileNameWithoutExtension)
                    .OrderBy(n => Regex.Replace(n, @"\d+", match => match.Value.PadLeft(4, '0')))
                    .ToList();
            var productImagesIds = productImagesPaths.Select(x => x.Split("-")[0]).ToList();
            var productImagesUrls = productImagesPaths.Select(x => @"images/products/" + x + @".png").ToList();

            // this is used to see if the product has more than one colour variation
            // we do this by looking at the file's 3 last characters:
            // 1-1 => it's a colour variation    d-1 => not a colour variation
            // so the pattern is "digit-digit" == colour variation and "letter-digit" != a colour variation
            // we will check with a regex in the loop when seeding ProductVariationImages
            var filesEndCharacters = productImagesPaths.Select(x => x[^3..]).ToList(); // 1-1 OR d-1

            var insertedProductVariations = await context.ProductVariations.ToListAsync();

            // [{ ..., sku, price, productId: 1 }, { ..., sku, price, productId: 1}, { ..., sku, price, productId: 1} ]
            var alreadySeen = new Dictionary<int, int>(); // { { 1: 1 }, { 2: 3 } }
            var prodVarImageId = 1;
            // we need the previous colour so we don't increment occurrences if variation is different but colour is the same
            var prevColour = string.Empty;
            foreach (var variation in insertedProductVariations)
            {
                string imageUrl;
                ProductVariationImage newProductVariationImage;
                if (!alreadySeen.TryGetValue(variation.ProductId, out var occurrences))
                {
                    occurrences = 1;
                    alreadySeen[variation.ProductId] = occurrences;

                    imageUrl = productImagesUrls[productImagesIds.IndexOf(variation.ProductId.ToString())];
                    newProductVariationImage = new ProductVariationImage
                    {
                        Id = prodVarImageId,
                        ImageUrl = imageUrl,
                        ProductVariationId = variation.Id,
                    };
                    await context.ProductVariationImages.AddAsync(newProductVariationImage);
                }
                else
                {
                    var currentColour = variation.VariationString.Split("_")[3];
                    if (
                        Regex.IsMatch(filesEndCharacters[productImagesIds.IndexOf(variation.ProductId.ToString())],
                            @"\d-\d") &&
                        currentColour != prevColour
                    )
                    {
                        occurrences++;
                        alreadySeen[variation.ProductId] = occurrences;
                        imageUrl =
                            productImagesUrls[
                                productImagesIds.IndexOf(variation.ProductId.ToString()) + occurrences - 1];
                        newProductVariationImage = new ProductVariationImage
                        {
                            Id = prodVarImageId,
                            ImageUrl = imageUrl,
                            ProductVariationId = variation.Id,
                        };
                        await context.ProductVariationImages.AddAsync(newProductVariationImage);
                    }
                    else
                    {
                        imageUrl =
                            productImagesUrls[
                                productImagesIds.IndexOf(variation.ProductId.ToString()) + occurrences - 1];
                        newProductVariationImage = new ProductVariationImage()
                        {
                            Id = prodVarImageId,
                            ImageUrl = imageUrl,
                            ProductVariationId = variation.Id,
                        };
                        await context.ProductVariationImages.AddAsync(newProductVariationImage);
                    }
                }

                await context.SaveChangesAsync();
                prodVarImageId++;
                prevColour = variation.VariationString.Split("_")[3];
            }

            // Update stock of individual ProductOptionValues, e.g. 32 Waist - 5 in stock
            products = await context.Products
                .Include(p => p.ProductOptions).ThenInclude(po => po.ProductOptionValues)
                .Include(p => p.ProductVariations)
                .ToListAsync();

            foreach (var product in products)
            {
                var colours = product.ProductOptions
                    .Where(po => po.Name == "Colour")
                    .SelectMany(po => po.ProductOptionValues)
                    .ToList();
                var sizes = product.ProductOptions
                    .Where(po => po.Name == "Size")
                    .SelectMany(po => po.ProductOptionValues)
                    .ToList();
                var waists = product.ProductOptions
                    .Where(po => po.Name == "Waist")
                    .SelectMany(po => po.ProductOptionValues)
                    .ToList();
                var lengths = product.ProductOptions
                    .Where(po => po.Name == "Length")
                    .SelectMany(po => po.ProductOptionValues)
                    .ToList();

                foreach (var colour in colours)
                {
                    IEnumerable<IEnumerable<string>> cartesianProduct;
                    List<List<string>> sets;
                    List<string> waistsList;
                    var currColourList = new List<string>{colour.Name };
                    
                    // T-SHIRTS OR SHOES
                    if (sizes.Any())
                    {
                        var sizesList = sizes.Select(s => s.Name).ToList();
                        
                        sets = new List<List<string>>
                        {
                            currColourList,
                            sizesList
                        };
                        cartesianProduct = CartesianProduct(sets);
                        colour.Stock = cartesianProduct.Count();
                        foreach (var size in sizes)
                        {
                            size.Stock = colours.Count; // 1 * number of colours
                        }

                        continue;
                    }

                    // SHORTS
                    if (waists.Any() && !lengths.Any())
                    {
                        waistsList = waists.Select(w => w.Name).ToList();
                        sets = new List<List<string>>
                        {
                            currColourList,
                            waistsList
                        };
                        cartesianProduct = CartesianProduct(sets);
                        colour.Stock = cartesianProduct.Count();
                        foreach (var waist in waists)
                        {
                            waist.Stock = colours.Count; // 1 * number of colours
                        }

                        continue;
                    }

                    // TROUSERS
                    if (waists.Any() && lengths.Any())
                    {
                        waistsList = waists.Select(w => w.Name).ToList();
                        var lengthsList = lengths.Select(l => l.Name).ToList();
                        sets = new List<List<string>>
                        {
                            currColourList,
                            waistsList,
                            lengthsList
                        };
                        cartesianProduct = CartesianProduct(sets);
                        colour.Stock = cartesianProduct.Count();
                        // loop over waists and lengths
                        foreach (var waist in waists)
                        {
                            waist.Stock = lengths.Count * colours.Count; // [24,26,28,30,32] & [Red, Blue] => 5 * 2
                        }
                        foreach (var length in lengths)
                        {
                            length.Stock = waists.Count * colours.Count; // [24,26,28,30,32] & [Red, Blue] => 5 * 2
                        }

                        continue;
                    }

                    // HATS
                    colour.Stock = 1;
                }
            }

            await context.SaveChangesAsync();
        }

        private static IEnumerable<IEnumerable> CreateProductVariationsSets(
            List<Product> products,
            List<ProductOption> productOptions,
            List<ProductOptionValue> productOptionValues)
        {
            // 1. create dictionary of productId and its optionIds
            var productOptionsDictionary = new Dictionary<int, List<int>>();
            foreach (var productOption in productOptions)
            {
                if (!productOptionsDictionary.TryGetValue(productOption.ProductId, out var optionsList))
                {
                    optionsList = new List<int>();
                    productOptionsDictionary[productOption.ProductId] = optionsList;
                }

                optionsList.Add(productOption.Id);
            }

            // 2. create sets of options for each productId
            // [
            //   [[1], [Venus], [Trousers],  [Mens], [Denim], [26, 28, 30, 32, 34, 36, 38], [28, 30, 32, 34]], productId 1
            //   [[2], [Jupiter], [Tshirt], [Mens], [Blue], [XS, S, M, L, XXL]], productId 2
            //   [[3], [Neptune], [Tshirt], [Womens], [Red, White], [XS, S, M, L, XXL]] productId 3
            //   .......
            // ]
            var variationsMatrix = new List<IList>();

            foreach (var (key, value) in productOptionsDictionary)
            {
                var prevId = 0;
                var currentProduct = products.FirstOrDefault(p => p.Id == key);

                var productNestedList = new List<List<string>>
                {
                    new()
                    {
                        currentProduct!.Id.ToString()
                    },
                    new()
                    {
                        currentProduct.Brand
                    },
                    new()
                    {
                        currentProduct.Type
                    }
                };

                foreach (var productOptionValue in productOptionValues
                    .Where(productOptionValue => value.Contains(productOptionValue.ProductOptionId)))
                {
                    if (prevId != productOptionValue.ProductOptionId)
                    {
                        productNestedList.Add(new List<string> { productOptionValue.Name });
                        prevId = productOptionValue.ProductOptionId;
                        continue;
                    }

                    productNestedList[^1].Add(productOptionValue.Name);
                    prevId = productOptionValue.ProductOptionId;
                }

                variationsMatrix.Add(productNestedList);
            }

            return variationsMatrix;
        }
        
        private static IEnumerable<IEnumerable<T>> CartesianProduct<T>(IEnumerable<IEnumerable<T>> sequences)
        {
            IEnumerable<IEnumerable<T>> emptyProduct = new[] { Enumerable.Empty<T>() };

            return sequences.Aggregate(
                emptyProduct,
                (accumulator, sequence) =>
                    from accseq in accumulator
                    from item in sequence
                    select accseq.Concat(new[] { item })
            );
        }
    }
}