using AutoMapper;
using ShoesShop.Models;
using ShoesShop.Service.DTOs.Brand;
using ShoesShop.Service.DTOs.CartItem;
using ShoesShop.Service.DTOs.Category;
using ShoesShop.Service.DTOs.Order;
using ShoesShop.Service.DTOs.OrderItem;
using ShoesShop.Service.DTOs.Product;
using ShoesShop.Service.DTOs.Review;
using ShoesShop.Service.DTOs.User;


namespace ShoesShop.Service.Mapping
{
    public class AutoMapperConfigProfile : Profile 
    {
        public AutoMapperConfigProfile()
        {
            //User
            CreateMap<ApplicationUser, UserDTO>();

            // Brand
            CreateMap<BrandCreateDTO, Brand>();
            CreateMap<Brand, BrandGetDTO>();

            // CartItem
            CreateMap<CartItemCreateDTO, CartItem>();
            CreateMap<CartItem, CartItemGetDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product!.ProductName))
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.Product!.Photo))
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Product!.Brand!.BrandName))
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Product!.Category!.CategoryName))
                .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Product!.Rating));

            CreateMap<CartItemUpdateDTO, CartItem>()
                .ForMember(dest => dest.User, opt => opt.Ignore()) 
                .ForMember(dest => dest.Product, opt => opt.Ignore());

            // Category
            CreateMap<CategoryCreateDTO, Category>();
            CreateMap<Category, CategoryGetDTO>();

            // Order
            CreateMap<OrderCreateDTO, Order>();
            CreateMap<Order, OrderGetDTO>()
                 .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User!.UserName))
                 .ForMember(dest => dest.Photos, opt => opt.MapFrom(src => src.OrderItems!.Select(oi => oi.Product!.Photo).ToList()));
            CreateMap<Order, OrderInfoDTO>()
                 .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User!.UserName))
                 .ForMember(dest => dest.OrderItems, opt => opt.MapFrom(src => src.OrderItems));

            // OrderItem
            CreateMap<OrderItemCreateDTO, OrderItem>();
            CreateMap<OrderItem, OrderItemGetDTO>()
                 .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product!.ProductName))
                 .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Product!.Category!.CategoryName))
                 .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Product!.Brand!.BrandName))
                 .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.Product!.Photo))
                 .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Product!.Description))
                 .ForMember(dest => dest.Rating, opt => opt.MapFrom(src => src.Product!.Rating));

            // Product
            CreateMap<ProductCreateDTO, Product>();
            CreateMap<Product, ProductGetDTO>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category!.CategoryName))
                .ForMember(dest => dest.BrandName, opt => opt.MapFrom(src => src.Brand!.BrandName));

            CreateMap<ProductUpdateDTO, Product>()
           .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<Product, ProductUpdateDTO>()
                .ForMember(dest => dest.BrandId, opt => opt.MapFrom(src => src.Brand!.Id))
                .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.Category!.Id))
                .ForMember(dest => dest.PhotoFile, opt => opt.MapFrom(src => src.Photo));

            // Review
            CreateMap<ReviewCreateDTO, Review>();
            CreateMap<Review, ReviewGetDTO>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product!.ProductName))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User!.UserName))
                .ForMember(dest => dest.Photo, opt => opt.MapFrom(src => src.User!.Photo));
        }
    }
}
