using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json.Serialization;
using API.Configurations;
using API.Extensions;
using API.Filters;
using API.Helpers;
using API.Middleware;
using API.ModelBinders;
using Core.Interfaces;
using Infrastructure;
using Infrastructure.Data;
using Infrastructure.Interfaces;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;

        public Startup(IConfiguration configuration)
        {
            _config = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IJwtUtils, JwtUtils>();
            services.AddScoped<IBasketService, BasketService>();
            services.AddScoped<IElasticSearchService, ElasticSearchService>();

            services.AddAutoMapper(typeof(Startup).Assembly);

            // Configuration 
            services.Configure<BaseUrlOptions>(_config.GetSection(BaseUrlOptions.BaseUrls));
            services.Configure<BasePathOptions>(_config.GetSection(BasePathOptions.BasePaths));

            services.AddControllers(options =>
            {
                options.Filters.Add<OperationCancelledExceptionFilter>();
                options.Filters.Add<DisableFormValueModelBindingAttribute>(); 
                options.ModelBinderProviders.Insert(0, new JsonQueryBinderProvider());
            });
            
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory =
                    context => new BadRequestObjectResult(context.ModelState);
            });
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
                c.EnableAnnotations();
            });

            // Shop Database
            services.AddDbContext<ShopContext>(opt =>
            {
                opt.UseMySql(
                    _config.GetConnectionString("DefaultConnection"),
                    new MySqlServerVersion(new Version(8, 0, 29)),
                    mySqlDbContextOptionsBuilder =>
                        mySqlDbContextOptionsBuilder
                            .EnableRetryOnFailure(5, TimeSpan.FromSeconds(5), new List<int>()));
            });

            services.AddElasticsearch(_config);
            services.AddIdentityServices();
            
            // Default implementation
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme);
            // services.AddAuth(_config);
            
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .WithOrigins("http://localhost:3000",
                            "https://localhost:5001",
                            "https://localhost:5001/api"); // Here adding 5001 for Swagger
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }
            else
            {
                app.UseExceptionHandler("/error");
            }

            // Helper middleware to log HTTP request            
            app.UseMiddleware<RequestLoggingMiddleware>();
            app.UseMiddleware<JwtMiddleware>();
            app.UseMiddleware<ExceptionMiddleware>();
            app.UseHttpsRedirection();
            app.UseRouting();
            // This is for wwwroot
            app.UseStaticFiles();
            // Custom file provider
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Content")),
                RequestPath = "/content"
            });
            app.UseSpaStaticFiles();
            app.UseCors("CorsPolicy");
            app.UseResponseCaching();
            
            // not using default auth
            // app.UseAuthentication();
            // app.UseAuthorization();
            
            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:3000");
            });
        }
    }
}