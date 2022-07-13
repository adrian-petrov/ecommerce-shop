using System;
using System.Collections.Generic;
using System.IO;
using API.Configurations;
using API.Extensions;
using API.Filters;
using API.Helpers;
using API.Middleware;
using API.ModelBinders;
using Core.Interfaces;
using Infrastructure;
using Infrastructure.Configurations;
using Infrastructure.Data;
using Infrastructure.Interfaces;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;

namespace API
{
    public class Startup
    {
        private static IConfigurationRoot Configuration { get; set; }
        private static IHostEnvironment CurrentEnvironment { get; set; }

        public Startup(IHostEnvironment environment)
        {
            var configBuilder = new ConfigurationBuilder()
                .SetBasePath(environment.ContentRootPath)
                .AddJsonFile("appsettings.json", false, true)
                .AddJsonFile($"appsettings.{environment.EnvironmentName}.json", true)
                .AddEnvironmentVariables("DOCKER_");
            Configuration = configBuilder.Build();
            CurrentEnvironment = environment;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // General Services
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IJwtUtils, JwtUtils>();
            services.AddScoped<IBasketService, BasketService>();
            // services.AddScoped<IElasticSearchService, ElasticSearchService>();
            services.AddAutoMapper(typeof(Startup).Assembly);

            // Configuration 
            services.Configure<BaseUrlOptions>(Configuration.GetSection(BaseUrlOptions.BaseUrls));
            services.Configure<BasePathOptions>(Configuration.GetSection(BasePathOptions.BasePaths));
            services.Configure<JwtOptions>(Configuration.GetSection(JwtOptions.Jwt));

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
                    Configuration.GetConnectionString("DefaultConnection"),
                    new MySqlServerVersion(new Version(8, 0, 29)),
                    mySqlDbContextOptionsBuilder =>
                        mySqlDbContextOptionsBuilder
                            .EnableRetryOnFailure(7, TimeSpan.FromSeconds(5), new List<int>()));
            });

            // services.AddElasticsearch(Configuration);
            services.AddIdentityServices();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme);

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    var origin = CurrentEnvironment.IsDevelopment()
                        ? "http://localhost:3000"
                        : "https://ecommerce-shop.adrianpetrov.com";
                    
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .WithOrigins(origin);
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
                app.UseMiddleware<RequestLoggingMiddleware>();
            }
            else
            {
                app.UseExceptionHandler("/error");
                app.UseHttpsRedirection();
                // For nginx reverse proxy
                app.UseForwardedHeaders(new ForwardedHeadersOptions
                {
                    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
                });
            }

            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "Content")),
                RequestPath = "/content"
            });
            app.UseSpaStaticFiles();
            app.UseMiddleware<JwtMiddleware>();
            app.UseMiddleware<ExceptionMiddleware>();
            app.UseRouting();
            app.UseCors("CorsPolicy");
            app.UseResponseCaching();
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