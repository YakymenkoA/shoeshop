using Microsoft.AspNetCore.Identity;
using ShoesShop.Data;
using ShoesShop.Models;

namespace ShoesShop.Service
{
    public class Seed
    {
        public static async Task SeedData(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
        {
            // Add roles
            string[] roleNames = { "Admin", "User" };

            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Add admin account
            var adminEmail = "admin@admin.com";
            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var admin = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    Photo = "admin.png",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(admin, "Admin_123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(admin, "Admin");
                }
            }

            // Add user account
            var userEmail = "user@user.com";
            if (await userManager.FindByEmailAsync(userEmail) == null)
            {
                var user = new ApplicationUser
                {
                    UserName = userEmail,
                    Email = userEmail,
                    Photo = "user.png",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(user, "User_123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, "User");
                }
            }

            // Add 5 default users
            for (int i = 1; i <= 5; i++)
            {
                var useremail = $"user{i}@user.com";
                if (await userManager.FindByEmailAsync(useremail) == null)
                {
                    var user = new ApplicationUser
                    {
                        UserName = useremail,
                        Email = useremail,
                        EmailConfirmed = true,
                        Photo = $"user{i}.png",
                    };

                    var result = await userManager.CreateAsync(user, "User_123");
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(user, "User");
                    }
                }
            }

            // Brands, Categories, Products
            if (!context.Brands.Any())
            {
                var brands = new List<Brand>
                {
                new Brand { BrandName = "Nike", Description = "Global leader in athletic footwear and apparel." },
                new Brand { BrandName = "Adidas", Description = "Innovative sportswear and footwear brand." },
                new Brand { BrandName = "Puma", Description = "German brand known for stylish and comfortable sports shoes." },
                new Brand { BrandName = "Reebok", Description = "A subsidiary of Adidas focused on fitness footwear and apparel." },
                new Brand { BrandName = "New Balance", Description = "Premium athletic and lifestyle footwear company." }
                };

                var categories = new List<Category>
                {
                new Category { CategoryName = "Athletic Shoes" },
                new Category { CategoryName = "Casual Shoes" },
                new Category { CategoryName = "Formal Shoes" },
                new Category { CategoryName = "Boots" },
                new Category { CategoryName = "Sandals & Slippers" }
                };
                await context.Brands.AddRangeAsync(brands);
                await context.Categories.AddRangeAsync(categories);
                await context.SaveChangesAsync();

                var products = new List<Product>
                {
                    new Product { ProductName = "Nike Air Zoom X", Description = "Lightweight running shoes with maximum cushioning.", Price = 150, CategoryId = 1, BrandId = 1, Discount = 0, Photo = "504459027.png", Rating = 0 },
                    new Product { ProductName = "Adidas Ultraboost Pro", Description = "High-performance running sneakers with energy return.", Price = 180, CategoryId = 1, BrandId = 2, Discount = 0, Photo = "504460528.png", Rating = 0.5 },
                    new Product { ProductName = "Puma Velocity Nitro", Description = "Sleek design with Nitro foam for ultra comfort.", Price = 130, CategoryId = 1, BrandId = 3, Discount = 5, Photo = "504454779.png", Rating = 1 },
                    new Product { ProductName = "Reebok Floatride Energy", Description = "Durable, high-grip trainers for long-distance runs.", Price = 140, CategoryId = 1, BrandId = 4, Discount = 0, Photo = "446449914.png", Rating = 1.5 },
                    new Product { ProductName = "New Balance Fresh Foam X", Description = "Premium stability shoes for runners.", Price = 160, CategoryId = 1, BrandId = 5, Discount = 0, Photo = "504458566.png", Rating = 2 },

                    new Product { ProductName = "Nike Everyday Slip-On", Description = "Stylish and breathable slip-on sneakers.", Price = 90, CategoryId = 2, BrandId = 1, Discount = 0, Photo = "504853524.png", Rating = 2.5 },
                    new Product { ProductName = "Adidas Cloudfoam Lite", Description = "Ultra-comfortable casual shoes with a soft sole.", Price = 85, CategoryId = 2, BrandId = 2, Discount = 0, Photo = "501169735.png", Rating = 3 },
                    new Product { ProductName = "Puma Street Rider", Description = "Retro-inspired sneakers for daily wear.", Price = 95, CategoryId = 2, BrandId = 3, Discount = 10, Photo = "504459900.png", Rating = 3.5 },
                    new Product { ProductName = "Reebok Classic Leather", Description = "Timeless casual shoes with premium leather.", Price = 100, CategoryId = 2, BrandId = 4, Discount = 0, Photo = "476216112.png", Rating = 4 },
                    new Product { ProductName = "New Balance 574 Core", Description = "Versatile sneakers with suede and mesh.", Price = 110, CategoryId = 2, BrandId = 5, Discount = 0, Photo = "489123524.png", Rating = 4.5 },

                    new Product { ProductName = "Nike Prestige Oxford", Description = "Modern leather Oxford shoes for business.", Price = 200, CategoryId = 3, BrandId = 1, Discount = 0, Photo = "405174520.png", Rating = 5 },
                    new Product { ProductName = "Adidas Executive Derby", Description = "Elegant Derby shoes with premium finish.", Price = 210, CategoryId = 3, BrandId = 2, Discount = 0, Photo = "439186093.png", Rating = 0 },
                    new Product { ProductName = "Puma Luxe Brogue", Description = "Stylish brogues with cushioned insoles.", Price = 190, CategoryId = 3, BrandId = 3, Discount = 15, Photo = "481522421.png", Rating = 0.5 },
                    new Product { ProductName = "Reebok Classic Monk Strap", Description = "Sleek monk strap shoes for formal wear.", Price = 220, CategoryId = 3, BrandId = 4, Discount = 0, Photo = "504458937.png", Rating = 1 },
                    new Product { ProductName = "New Balance Executive Loafer", Description = "Comfortable, high-end loafers.", Price = 230, CategoryId = 3, BrandId = 5, Discount = 0, Photo = "501432353.png", Rating = 1.5 },

                    new Product { ProductName = "Nike Trail Master Boot", Description = "Rugged hiking boots for tough terrains.", Price = 170, CategoryId = 4, BrandId = 1, Discount = 0, Photo = "471983408.png", Rating = 2 },
                    new Product { ProductName = "Adidas Adventure Trek", Description = "Waterproof, all-season trekking boots.", Price = 180, CategoryId = 4, BrandId = 2, Discount = 0, Photo = "481520429.png", Rating = 2.5 },
                    new Product { ProductName = "Puma Urban Combat Boot", Description = "High-ankle boots for urban explorers.", Price = 175, CategoryId = 4, BrandId = 3, Discount = 20, Photo = "475396865.png", Rating = 3 },
                    new Product { ProductName = "Reebok Tactical Pro", Description = "Military-grade boots with reinforced grip.", Price = 185, CategoryId = 4, BrandId = 4, Discount = 0, Photo = "504461050.png", Rating = 3.5 },
                    new Product { ProductName = "New Balance Heritage Hiker", Description = "All-weather boots with superior comfort.", Price = 190, CategoryId = 4, BrandId = 5, Discount = 0, Photo = "501142877.png", Rating = 4 },

                    new Product { ProductName = "Nike Air Slide", Description = "Soft, ergonomic slides for all-day wear.", Price = 50, CategoryId = 5, BrandId = 1, Discount = 0, Photo = "501419420.png", Rating = 4.5 },
                    new Product { ProductName = "Adidas Adilette Comfort", Description = "Iconic slides with extra cushioning.", Price = 55, CategoryId = 5, BrandId = 2, Discount = 0, Photo = "501417160.png", Rating = 5 },
                    new Product { ProductName = "Puma Easy Sandal", Description = "Durable, lightweight summer sandals.", Price = 45, CategoryId = 5, BrandId = 3, Discount = 25, Photo = "517250273.png", Rating = 0 },
                    new Product { ProductName = "Reebok Beach Cruiser", Description = "Stylish slip-ons for beach and poolside.", Price = 60, CategoryId = 5, BrandId = 4, Discount = 0, Photo = "503677607.png", Rating = 0.5 },
                    new Product { ProductName = "New Balance Relax Foam", Description = "Ultra-soft slippers with memory foam.", Price = 65, CategoryId = 5, BrandId = 5, Discount = 0, Photo = "510786994.png", Rating = 1 }
                };

                await context.Products.AddRangeAsync(products);
                await context.SaveChangesAsync();
            }

            // Orders, OrderItems
            if (!context.Orders.Any())
            {
                Random random = new();

                var adminId = "";
                var createdAdmin = await userManager.FindByEmailAsync(adminEmail);
                if (createdAdmin != null)
                {
                    adminId = createdAdmin.Id;
                }
                var userId = adminId;

                var statusOptions = new string[] { "Completed", "Cancelled", "Shipped", "Processing" };
                var orders = new List<Order>();
                var orderItems = new List<OrderItem>();

                for (int i = 1; i <= 10; i++)
                {
                    int orderId = i;
                    int numItems = random.Next(1, 11);

                    var itemsForOrder = new List<OrderItem>();
                    decimal totalPrice = 0;

                    for (int j = 0; j < numItems; j++)
                    {
                        int productId = random.Next(1, 26);
                        int quantity = random.Next(1, 6);
                        var shoeSize = random.Next(35, 48).ToString();

                        var product = context.Products.FirstOrDefault(p => p.Id == productId);
                        if (product != null)
                        {
                            decimal itemTotal = product.Price * quantity;
                            totalPrice += itemTotal;

                            itemsForOrder.Add(new OrderItem
                            {
                                ProductId = productId,
                                Quantity = quantity,
                                OrderId = orderId,
                                Price = product.Price,
                                ShoeSize = shoeSize
                            });
                        }
                    }

                    var order = new Order
                    {
                        UserId = userId,
                        OrderDate = DateTime.UtcNow.AddDays(-random.Next(1, 30)),
                        TotalPrice = totalPrice,
                        Status = statusOptions[random.Next(statusOptions.Length)]
                    };

                    orders.Add(order);
                    orderItems.AddRange(itemsForOrder);
                }

                await context.Orders.AddRangeAsync(orders);
                await context.SaveChangesAsync();
                await context.OrderItems.AddRangeAsync(orderItems);
                await context.SaveChangesAsync();
            }
            
            // Reviews
            if(!context.Reviews.Any())
            {
                var userEmails = new List<string>
                {
                    "user1@user.com",
                    "user2@user.com",
                    "user3@user.com",
                    "user4@user.com",
                    "user5@user.com"
                };

                var users = new Dictionary<string, string>();
                foreach (var email in userEmails)
                {
                    var user = await userManager.FindByEmailAsync(email);
                    if (user != null)
                    {
                        users[email] = user.Id;
                    }
                }

                var reviews = new List<Review>();
                var comments = new Dictionary<int, string[]>
                {
                    {1, new[] {"Terrible quality, fell apart quickly.", "Not comfortable at all, regret buying."} },
                    {2, new[] {"Not the best, but does the job.", "A bit uncomfortable, wouldn't recommend."} },
                    {3, new[] {"Decent shoes, nothing special.", "Average, works fine for daily use."} },
                    {4, new[] {"Comfortable and stylish, quite happy.", "Good quality, would buy again."} },
                    {5, new[] {"Amazing shoes, best I’ve ever owned!", "Top-notch comfort and durability."} }
                };

                var random = new Random();
                foreach (var productId in Enumerable.Range(1, 25))
                {
                    int rating = 1;
                    foreach (var userId in users.Values)
                    {
                        var commentOptions = comments[rating];
                        var review = new Review
                        {
                            UserId = userId,
                            ProductId = productId,
                            Rating = rating,
                            Comment = commentOptions[random.Next(commentOptions.Length)]
                        };
                        reviews.Add(review);

                        rating = rating % 5 + 1;
                    }
                }

                await context.Reviews.AddRangeAsync(reviews);
                await context.SaveChangesAsync();
            }

            //Promocodes
            if (!context.Promocodes.Any())
            {
                var promoCodes = Enumerable.Range(1, 10).Select(i => new Promocode
                {
                    Code = $"QWERTY{5 * i}",
                    Discount = 5 * i,
                    AmountOfUses = 20
                }).ToList();

                await context.Promocodes.AddRangeAsync(promoCodes);
                await context.SaveChangesAsync();
            }
        }
    }
}
