using System;
using System.Linq;
using System.Threading.Tasks;
using Core.ElasticsearchModels;
using Core.Entities.Identity;
using Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Nest;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();

                try
                {
                    // Migration
                    var context = services.GetRequiredService<ShopContext>();
                    await context.Database.MigrateAsync();

                    // Seed database
                    var config = 
                        new ConfigurationBuilder()
                            .AddJsonFile("appsettings.json")
                            .AddEnvironmentVariables("DOCKER_") 
                            .Build();
                    var seedDataPath = config.GetSection("BasePaths:SeedDataPath").Value;
                    var contentPath = config.GetSection("BasePaths:ContentPath").Value;
                    await ShopContextSeed.SeedShopDataAsync(context, loggerFactory, seedDataPath, contentPath);

                    var userManager = services.GetRequiredService<UserManager<AppUser>>();
                    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();

                    await ShopContextSeed.SeedRolesAndDefaultUsers(userManager, roleManager);
                    
                    // Seed Elasticsearch
                    var elasticClient = services.GetRequiredService<IElasticClient>();
                    var products = await context.Products
                        .Include(p => p.Images)
                        .AsNoTracking()
                        .ToListAsync();

                    var productsBaseUrl = config.GetSection("BaseUrls:ProductsBase").Value;
                    
                    var elasticProducts = products.Select(p => new ElasticSearchProduct
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Brand = p.Brand,
                        BasePrice = p.BasePrice,
                        ImageUrl = $"{productsBaseUrl}/{p.Images.ToList().First().ImageUrl}"
                    }).ToList();
                    
                    var bulkIndexResponse = await elasticClient.BulkAsync(b => b
                        .Index("products")
                        .IndexMany(elasticProducts));

                    if (bulkIndexResponse.Errors)
                    {
                        foreach (var item in bulkIndexResponse.ItemsWithErrors)
                        {
                            Console.WriteLine($"Failed to index document {item.Id}: {item.Error}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    var logger = loggerFactory.CreateLogger<Program>();
                    logger.LogError(ex, "An error has occured during the migration or data seeding");
                }
            }
            await host.RunAsync();
        }

        private static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}