using System.Collections.Generic;
using System.Linq;
using API.Dtos;
using AutoMapper;
using Core.ElasticsearchModels;
using Core.Entities;
using Core.Entities.OrderAggregate;

namespace API.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // STORE FRONT
            CreateMap<ProductVariation, ProductVariationResponseDto>()
                .ForMember(
                    dto => dto.ImageUrl,
                    opt =>
                    {
                        opt.PreCondition(src => src.ProductVariationImage != null);
                        opt.MapFrom<ProductVariationUrlResolver<ProductVariationResponseDto>>();
                    });
            CreateMap<ProductOption, ProductOptionResponseDto>();
            CreateMap<ProductOptionValue, ProductOptionValueResponseDto>();
            CreateMap<BasketItem, BasketItemResponseDto>()
                .ForMember(
                    dto => dto.ProductId,
                    opt => opt.MapFrom(src => src.ProductVariation.Product.Id))
                .ForMember(
                    dto => dto.ProductName,
                    opt => opt.MapFrom(src => src.ProductVariation.Product.Name))
                .ForMember(
                    dto => dto.ProductType,
                    opt => opt.MapFrom(src => src.ProductVariation.Product.Type))
                .ForMember(
                    dto => dto.ProductVariationString,
                    opt => opt.MapFrom(src => src.ProductVariation.VariationString))
                .ForMember(
                    dto => dto.Stock,
                    opt => opt.MapFrom(src => src.ProductVariation.TotalStock))
                .ForMember(
                    dto => dto.ImageUrl,
                    opt => opt.MapFrom<BasketItemUrlResolver>())
                .ForMember(
                    dto => dto.Colour,
                    opt => opt.MapFrom<BasketItemColourResolver>())
                .ForMember(
                    dto => dto.Size,
                    opt => opt.MapFrom<BasketItemSizeResolver>())
                .ForMember(
                    dto => dto.Waist,
                    opt => opt.MapFrom<BasketItemWaistResolver>())
                .ForMember(
                    dto => dto.Length,
                    opt => opt.MapFrom<BasketItemLengthResolver>());
            CreateMap<Basket, BasketResponseDto>();
            CreateMap<Order, OrderResponseDto>()
                .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
                .ForMember(d => d.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price))
                .ForMember(d => d.OrderDate, o => o.MapFrom(s =>
                    $"{s.OrderDate.ToShortDateString()} {s.OrderDate.ToShortTimeString()}"
                ));
            CreateMap<OrderItem, OrderItemResponseDto>()
                .ForMember(d => d.ProductVariationId, o => o.MapFrom(s => s.ItemOrdered.ProductVariationId))
                .ForMember(d => d.ProductVariationString, o => o.MapFrom(s => s.ItemOrdered.ProductVariatingString))
                .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.ProductName))
                .ForMember(dto => dto.PictureUrl, opt => opt.MapFrom<OrderItemUrlResolver>());
            CreateMap<BillingAddress, BillingAddressResponseDto>();
            CreateMap<Product, ProductResponseDto>()
                .ForMember(
                    dto => dto.ProductOptions,
                    opt => opt.PreCondition(src => src.ProductOptions != null));
            CreateMap<Image, ImageResponseDto>()
                .ForMember(
                    dto => dto.ImageUrl,
                    opt => opt.MapFrom<ImageUrlResolver<ImageResponseDto>>());
            CreateMap<ProductType, ProductTypeResponseDto>();
            CreateMap<ProductBrand, ProductBrandResponseDto>();
            CreateMap<Option, OptionResponseDto>()
                .ForMember(
                    dto => dto.Values,
                    opt => opt.MapFrom(src => src.OptionValues.Select(ov => ov.Name)));


            // ADMIN SIDE
            CreateMap<ProductOptionValue, AdminProductOptionValueResponseDto>()
                .ForMember(d => d.Name, o => o.MapFrom<AdminProductOptionValueResolver>())
                .ForAllMembers(o => o.PreCondition((src, dest) => src.Option != null));
                
            CreateMap<ProductOption, AdminProductOptionResponseDto>();
            CreateMap<Option, AdminOptionResponseDto>();
            CreateMap<OptionValue, AdminOptionValueResponseDto>()
                .ForMember(d => d.Name, o => o.MapFrom<AdminOptionValueResolver>());
            CreateMap<ProductVariation, AdminProductVariationResponseDto>()
                .ForMember(d => d.Name, o => o.MapFrom(s => s.Product.Name))
                .ForMember(d => d.Brand, o => o.MapFrom(s => s.Product.Brand))
                .ForMember(d => d.Type, o => o.MapFrom(s => s.Product.Type))
                .ForMember(d => d.ImageUrl,
                    o => o.MapFrom<ProductVariationUrlResolver<AdminProductVariationResponseDto>>())
                .ForMember(d => d.ProductImages, o => o.MapFrom(s => s.Product.Images));
            CreateMap<Product, AdminProductResponseDto>();
            CreateMap<Image, AdminImageResponseDto>()
                .ForMember(
                    d => d.ImageUrl,
                    o => o.MapFrom<ImageUrlResolver<AdminImageResponseDto>>());
            CreateMap<Product, ElasticSearchProduct>()
                .ForMember(d => d.ImageUrl, o => o.MapFrom<ElasticSearchImageUrlResolver>());
        }
    }
}