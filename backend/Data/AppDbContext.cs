using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ─── 1. Seed Categories ──────────────────────────────────────────────
            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Laptop & Workstation" },
                new Category { Id = 2, Name = "Bàn phím cơ Custom" },
                new Category { Id = 3, Name = "Gaming Gear & Audio" }
            );

            // ─── 2. Seed Users (pre-hashed bcrypt for EF determinism) ────────────
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    FullName = "Super Admin",
                    Email = "admin@store.com",
                    PasswordHash = "$2a$11$MlqmJr7cWAkfegUm.AfKm.1LVRCf7Ium1oloWouUvJF2wiS6XA4QW",
                    Role = "Admin",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = 2,
                    FullName = "Khách hàng Demo",
                    Email = "user@store.com",
                    PasswordHash = "$2a$11$B5mEWwPSBiXg819Bb.Wa7eOzTobbxP70nYlEROXUokfn5.jGMc1z6",
                    Role = "Customer",
                    CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );

            // ─── 3. Seed Products (21 flagship products with optimized Unsplash URLs) ──
            modelBuilder.Entity<Product>().HasData(
                // ==================== [CAT 1: LAPTOP & WORKSTATION] ====================
                new Product
                {
                    Id = 1,
                    Name = "Apple MacBook Pro 16\" M3 Max",
                    Description = "Chip Apple M3 Max 16-core CPU, 40-core GPU. RAM 48GB Unified Memory, SSD 1TB NVMe. Màn hình Liquid Retina XDR 16.2 inch ProMotion 120Hz, HDR1600 nits đỉnh cao. Thời lượng pin 22 giờ. Màu Space Black huyền thoại.",
                    Price = 89990000m,
                    StockQuantity = 12,
                    ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Id = 2,
                    Name = "ASUS ROG Zephyrus G16 (2024) OLED",
                    Description = "Intel Core Ultra 9 185H, NVIDIA GeForce RTX 4090 Laptop GPU 16GB GDDR6. RAM 32GB LPDDR5X 7467MHz, SSD 2TB PCIe 4.0. Màn hình ROG Nebula OLED 2.5K 240Hz 0.2ms, G-Sync, 100% DCI-P3. Khung nhôm CNC siêu mỏng 1.49cm.",
                    Price = 74990000m,
                    StockQuantity = 8,
                    ImageUrl = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Id = 3,
                    Name = "Dell XPS 15 OLED 9530",
                    Description = "Intel Core i9-13900H 14-core, NVIDIA GeForce RTX 4070 8GB. RAM 32GB DDR5 4800MHz, SSD 1TB. Màn hình OLED 3.5K InfinityEdge cảm ứng, 100% DCI-P3, DisplayHDR 500. Vỏ nhôm nguyên khối phay kim cương kèm sợi carbon.",
                    Price = 62990000m,
                    StockQuantity = 15,
                    ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Id = 4,
                    Name = "Lenovo ThinkPad X1 Carbon Gen 12",
                    Description = "Chuẩn doanh nhân bền bỉ MIL-STD 810H. Intel Core Ultra 7 155H NPU AI, RAM 32GB LPDDR5X, SSD 1TB OPAL 2.0. Màn hình 14\" 2.8K OLED 120Hz chống lóa. Bàn phím TrackPoint huyền thoại, camera 8MP Computer Vision.",
                    Price = 54990000m,
                    StockQuantity = 10,
                    ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Id = 5,
                    Name = "Lenovo Legion Pro 7i Gen 9",
                    Description = "Chiến thần Gaming: Intel Core i9-14900HX 24 cores/32 threads, RTX 4080 12GB TGP 175W. RAM 32GB DDR5 5600MHz, SSD 1TB. Tản nhiệt buồng hơi Legion Coldfront Vapor. Màn hình PureSight Gaming 16\" WQXGA 240Hz 500 nits.",
                    Price = 68990000m,
                    StockQuantity = 7,
                    ImageUrl = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Id = 6,
                    Name = "Razer Blade 16 Dual-Mode Mini-LED",
                    Description = "Intel Core i9-14900HX, RTX 4080 12GB GDDR6. RAM 32GB DDR5, SSD 1TB. Màn hình đột phá Dual-Mode: Chuyển đổi giữa UHD+ 120Hz (Sáng tạo) & FHD+ 240Hz (Thi đấu eSports). Khung nhôm Anodized T6 sang trọng.",
                    Price = 82990000m,
                    StockQuantity = 5,
                    ImageUrl = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Id = 7,
                    Name = "Acer Predator Helios 16",
                    Description = "Intel Core i9-13900HX, RTX 4070 8GB TGP 140W. RAM 16GB DDR5 5600MHz, SSD 1TB NVMe PCIe 4.0. Tản nhiệt quạt kim loại 3D AeroBlade thế hệ 5 kết hợp keo tản nhiệt kim loại lỏng. Màn hình 16\" IPS 240Hz 100% DCI-P3.",
                    Price = 49990000m,
                    StockQuantity = 14,
                    ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },

                // ==================== [CAT 2: BÀN PHÍM CƠ CUSTOM] ====================
                new Product
                {
                    Id = 8,
                    Name = "Keychron Q1 Pro QMK/VIA Wireless",
                    Description = "Layout 75% compact, case nhôm CNC 6063 anodized nguyên khối, PCB Double-Gasket mount cách âm vượt trội. Switch Gateron Jupiter Red mượt mà. Đèn RGB South-facing, kết nối Bluetooth 5.1 & Type-C. Hỗ trợ QMK/VIA keymap.",
                    Price = 4890000m,
                    StockQuantity = 30,
                    ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 2
                },
                new Product
                {
                    Id = 9,
                    Name = "Nuphy Air96 v2 Wireless Low Profile",
                    Description = "Layout 96% full phím số siêu mỏng nhẹ 595g. Switch Low-profile Gateron KS-33 Red êm ái. Hỗ trợ QMK/VIA, tần số phản hồi 1000Hz ở chế độ 2.4GHz. Pin dung lượng lớn 4000mAh dùng 300 giờ. Keycap PBT dye-sub cao cấp.",
                    Price = 3290000m,
                    StockQuantity = 45,
                    ImageUrl = "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 2
                },
                new Product
                {
                    Id = 10,
                    Name = "MonsGeek M1 V3 Aluminium QMK",
                    Description = "Bàn phím cơ Custom vỏ nhôm CNC thuần khiết nặng 1.95kg, mạch xuôi Hotswap 5-pin. Núm xoay đa phương tiện kim loại sang trọng. Cấu trúc Gasket-mount nhiều lớp foam PORON & IXPE cho âm gõ 'clack' trầm ấm gây nghiện.",
                    Price = 2650000m,
                    StockQuantity = 28,
                    ImageUrl = "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 2
                },
                new Product
                {
                    Id = 11,
                    Name = "WOB Rainy 75 CNC Gasket Mount",
                    Description = "Hiện tượng bàn phím cơ 2024: Vỏ nhôm CNC tinh xảo, tạ đáy gương thép không gỉ. Cấu trúc Gasket mount tối ưu flex-cut mang lại âm thanh 'mưa rơi' (thocky) đỉnh cao ngay khi đập hộp. Kết nối 3 chế độ (Type-C, 2.4G, BT5.0).",
                    Price = 2490000m,
                    StockQuantity = 35,
                    ImageUrl = "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 2
                },
                new Product
                {
                    Id = 12,
                    Name = "Meletrix Zoom75 TKL Premium Custom",
                    Description = "Kit phím cơ Custom cao cấp của Meletrix. Màn hình LCD 2 inch hiển thị GIF & trạng thái hệ thống. Case nhôm sơn tĩnh điện mịn màng. Cấu trúc Gasket mount lò xo lá cải tiến, Bluetooth 5.0 kết nối mượt mà cùng lúc 3 thiết bị.",
                    Price = 5690000m,
                    StockQuantity = 12,
                    ImageUrl = "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 2
                },
                new Product
                {
                    Id = 13,
                    Name = "Lofree Flow 84 Low-Profile Smooth",
                    Description = "Bàn phím cơ low-profile êm nhất thế giới với switch Kailh Full-POM tự bôi trơn. Cấu trúc Gasket mount đầu tiên trên phím mỏng. Vỏ nhôm all-metal siêu bền, đèn nền trắng tinh tế & dải LED RGB hông ambient light nghệ thuật.",
                    Price = 3850000m,
                    StockQuantity = 22,
                    ImageUrl = "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 2
                },
                new Product
                {
                    Id = 14,
                    Name = "Qwertykeys Neo65 Tri-Mode Hotswap",
                    Description = "Thiết kế O-ring mount & Gasket mount kép linh hoạt. Khung nhôm vát cạnh tinh tế, tạ đồng PVD bóng gương. Hotswap mạch xuôi per-key RGB, tương thích hoàn toàn QMK/VIA. Kết nối đa năng 2.4Ghz độ trễ siêu thấp.",
                    Price = 3150000m,
                    StockQuantity = 18,
                    ImageUrl = "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 2
                },

                // ==================== [CAT 3: GAMING GEAR & AUDIO] ====================
                new Product
                {
                    Id = 15,
                    Name = "Sony WH-1000XM5 Wireless ANC",
                    Description = "Công nghệ chống ồn chủ động hàng đầu thế giới với 8 micro kép và 2 bộ xử lý chuyên dụng V1 + QN1. Màng loa sợi carbon 30mm cho âm thanh Hi-Res LDAC sắc sảo. Thời lượng pin 30 giờ (bật ANC), sạc nhanh 3 phút được 3 giờ nghe.",
                    Price = 8490000m,
                    StockQuantity = 25,
                    ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 3
                },
                new Product
                {
                    Id = 16,
                    Name = "Logitech G Pro X Superlight 2",
                    Description = "Chuột thi đấu eSports nhẹ nhất chỉ 60g. Cảm biến quang học HERO 2 đạt 32.000 DPI, tốc độ quét 500 IPS. Switch lai quang học-cơ học LIGHTFORCE độ bền 100 triệu lần nhấn. Kết nối LIGHTSPEED 2.4GHz tần số quét cực đại 4000Hz.",
                    Price = 2990000m,
                    StockQuantity = 50,
                    ImageUrl = "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 3
                },
                new Product
                {
                    Id = 17,
                    Name = "BenQ MOBIUZ EX2710U 4K 144Hz",
                    Description = "Màn hình gaming chuyên nghiệp 27\" IPS 4K UHD 144Hz, HDR600 True Black, 98% DCI-P3. Công nghệ bảo vệ mắt Eye-Care độc quyền BenQ. Loa 2.1 kênh treVolo tích hợp subwoofer mạnh mẽ, HDMI 2.1 tương thích trọn vẹn PS5/Xbox Series X.",
                    Price = 18990000m,
                    StockQuantity = 10,
                    ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a573d5f5ea?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 3
                },
                new Product
                {
                    Id = 18,
                    Name = "SteelSeries Arctis Nova Pro Wireless",
                    Description = "Tai nghe Gaming đẳng cấp số 1: Hệ thống âm thanh Nova Pro Acoustic Hi-Res với GameDAC Gen 2. Chống ồn chủ động ANC 4 micro. Trạm sạc Base Station kép pin thay nóng vô hạn (Infinity Power System), hỗ trợ kết nối đồng thời PC và Bluetooth.",
                    Price = 9490000m,
                    StockQuantity = 14,
                    ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 3
                },
                new Product
                {
                    Id = 19,
                    Name = "Razer Viper V3 Pro Wireless 8K",
                    Description = "Chuột thể thao điện tử thiết kế đối xứng siêu nhẹ 54g. Cảm biến Focus Pro 35K Optical Gen-2 chính xác tuyệt đối 99.8%. Tần số phản hồi không dây HyperPolling 8000Hz (0.125ms delay). Feet chuột 100% PTFE di chuyển mượt mà.",
                    Price = 3990000m,
                    StockQuantity = 32,
                    ImageUrl = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 3
                },
                new Product
                {
                    Id = 20,
                    Name = "LG UltraGear OLED 27GR95QE 240Hz",
                    Description = "Màn hình Gaming đỉnh cao tấm nền OLED 27\" QHD (2560x1440), tần số quét 240Hz thời gian phản hồi siêu tốc 0.03ms. Độ tương phản vô cực 1.500.000:1, chuẩn màu DCI-P3 98.5%. Đèn viền Hexagon RGB Gaming Lighting mặt lưng sống động.",
                    Price = 19990000m,
                    StockQuantity = 8,
                    ImageUrl = "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 3
                },
                new Product
                {
                    Id = 21,
                    Name = "Shure MV7 Podcast Microphone XLR/USB",
                    Description = "Microphone thu âm chuyên nghiệp lấy cảm hứng từ huyền thoại SM7B. Kết nối kép USB-C & XLR. Công nghệ cách ly giọng nói Voice Isolation loại bỏ hoàn toàn tạp âm phòng. Bảng điều khiển cảm ứng trực quan chỉnh Gain, Monitor và Mute tức thì.",
                    Price = 6890000m,
                    StockQuantity = 20,
                    ImageUrl = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 3
                }
            );

            // ─── 4. Seed Orders (Sample orders for Admin Dashboard) ──────────────
            modelBuilder.Entity<Order>().HasData(
                new Order
                {
                    Id = 1,
                    UserId = 2,
                    OrderDate = new DateTime(2024, 10, 15, 14, 30, 0, DateTimeKind.Utc),
                    TotalAmount = 74990000m,
                    Status = "Processing"
                },
                new Order
                {
                    Id = 2,
                    UserId = 2,
                    OrderDate = new DateTime(2024, 10, 12, 9, 15, 0, DateTimeKind.Utc),
                    TotalAmount = 4890000m,
                    Status = "Completed"
                },
                new Order
                {
                    Id = 3,
                    UserId = 2,
                    OrderDate = new DateTime(2024, 10, 20, 16, 45, 0, DateTimeKind.Utc),
                    TotalAmount = 2990000m,
                    Status = "Pending"
                },
                new Order
                {
                    Id = 4,
                    UserId = 2,
                    OrderDate = new DateTime(2024, 10, 21, 10, 0, 0, DateTimeKind.Utc),
                    TotalAmount = 11480000m,
                    Status = "Processing"
                }
            );

            // ─── 5. Seed OrderItems ──────────────────────────────────────────────
            modelBuilder.Entity<OrderItem>().HasData(
                new OrderItem
                {
                    Id = 1,
                    OrderId = 1,
                    ProductId = 2, // ASUS ROG Zephyrus G16
                    Quantity = 1,
                    UnitPrice = 74990000m
                },
                new OrderItem
                {
                    Id = 2,
                    OrderId = 2,
                    ProductId = 8, // Keychron Q1 Pro
                    Quantity = 1,
                    UnitPrice = 4890000m
                },
                new OrderItem
                {
                    Id = 3,
                    OrderId = 3,
                    ProductId = 16, // Logitech G Pro X Superlight 2
                    Quantity = 1,
                    UnitPrice = 2990000m
                },
                new OrderItem
                {
                    Id = 4,
                    OrderId = 4,
                    ProductId = 15, // Sony WH-1000XM5
                    Quantity = 1,
                    UnitPrice = 8490000m
                },
                new OrderItem
                {
                    Id = 5,
                    OrderId = 4,
                    ProductId = 16, // Logitech G Pro X Superlight 2
                    Quantity = 1,
                    UnitPrice = 2990000m
                }
            );
        }

    }
}
