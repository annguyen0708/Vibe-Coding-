using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    FullName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Role = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    StockQuantity = table.Column<int>(type: "INTEGER", nullable: false),
                    ImageUrl = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    CategoryId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    OrderDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "TEXT", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OrderId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProductId = table.Column<int>(type: "INTEGER", nullable: false),
                    Quantity = table.Column<int>(type: "INTEGER", nullable: false),
                    UnitPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Laptop & Workstation" },
                    { 2, "Bàn phím cơ Custom" },
                    { 3, "Gaming Gear & Audio" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "admin@store.com", "Super Admin", "$2a$11$MlqmJr7cWAkfegUm.AfKm.1LVRCf7Ium1oloWouUvJF2wiS6XA4QW", "Admin" },
                    { 2, new DateTime(2024, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "user@store.com", "Khách hàng Demo", "$2a$11$B5mEWwPSBiXg819Bb.Wa7eOzTobbxP70nYlEROXUokfn5.jGMc1z6", "Customer" }
                });

            migrationBuilder.InsertData(
                table: "Orders",
                columns: new[] { "Id", "OrderDate", "Status", "TotalAmount", "UserId" },
                values: new object[,]
                {
                    { 1, new DateTime(2024, 10, 15, 14, 30, 0, 0, DateTimeKind.Utc), "Processing", 74990000m, 2 },
                    { 2, new DateTime(2024, 10, 12, 9, 15, 0, 0, DateTimeKind.Utc), "Completed", 4890000m, 2 },
                    { 3, new DateTime(2024, 10, 20, 16, 45, 0, 0, DateTimeKind.Utc), "Pending", 2990000m, 2 },
                    { 4, new DateTime(2024, 10, 21, 10, 0, 0, 0, DateTimeKind.Utc), "Processing", 11480000m, 2 }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CategoryId", "Description", "ImageUrl", "Name", "Price", "StockQuantity" },
                values: new object[,]
                {
                    { 1, 1, "Chip Apple M3 Max 16-core CPU, 40-core GPU. RAM 48GB Unified Memory, SSD 1TB NVMe. Màn hình Liquid Retina XDR 16.2 inch ProMotion 120Hz, HDR1600 nits đỉnh cao. Thời lượng pin 22 giờ. Màu Space Black huyền thoại.", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80", "Apple MacBook Pro 16\" M3 Max", 89990000m, 12 },
                    { 2, 1, "Intel Core Ultra 9 185H, NVIDIA GeForce RTX 4090 Laptop GPU 16GB GDDR6. RAM 32GB LPDDR5X 7467MHz, SSD 2TB PCIe 4.0. Màn hình ROG Nebula OLED 2.5K 240Hz 0.2ms, G-Sync, 100% DCI-P3. Khung nhôm CNC siêu mỏng 1.49cm.", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80", "ASUS ROG Zephyrus G16 (2024) OLED", 74990000m, 8 },
                    { 3, 1, "Intel Core i9-13900H 14-core, NVIDIA GeForce RTX 4070 8GB. RAM 32GB DDR5 4800MHz, SSD 1TB. Màn hình OLED 3.5K InfinityEdge cảm ứng, 100% DCI-P3, DisplayHDR 500. Vỏ nhôm nguyên khối phay kim cương kèm sợi carbon.", "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=600&q=80", "Dell XPS 15 OLED 9530", 62990000m, 15 },
                    { 4, 1, "Chuẩn doanh nhân bền bỉ MIL-STD 810H. Intel Core Ultra 7 155H NPU AI, RAM 32GB LPDDR5X, SSD 1TB OPAL 2.0. Màn hình 14\" 2.8K OLED 120Hz chống lóa. Bàn phím TrackPoint huyền thoại, camera 8MP Computer Vision.", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80", "Lenovo ThinkPad X1 Carbon Gen 12", 54990000m, 10 },
                    { 5, 1, "Chiến thần Gaming: Intel Core i9-14900HX 24 cores/32 threads, RTX 4080 12GB TGP 175W. RAM 32GB DDR5 5600MHz, SSD 1TB. Tản nhiệt buồng hơi Legion Coldfront Vapor. Màn hình PureSight Gaming 16\" WQXGA 240Hz 500 nits.", "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80", "Lenovo Legion Pro 7i Gen 9", 68990000m, 7 },
                    { 6, 1, "Intel Core i9-14900HX, RTX 4080 12GB GDDR6. RAM 32GB DDR5, SSD 1TB. Màn hình đột phá Dual-Mode: Chuyển đổi giữa UHD+ 120Hz (Sáng tạo) & FHD+ 240Hz (Thi đấu eSports). Khung nhôm Anodized T6 sang trọng.", "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80", "Razer Blade 16 Dual-Mode Mini-LED", 82990000m, 5 },
                    { 7, 1, "Intel Core i9-13900HX, RTX 4070 8GB TGP 140W. RAM 16GB DDR5 5600MHz, SSD 1TB NVMe PCIe 4.0. Tản nhiệt quạt kim loại 3D AeroBlade thế hệ 5 kết hợp keo tản nhiệt kim loại lỏng. Màn hình 16\" IPS 240Hz 100% DCI-P3.", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80", "Acer Predator Helios 16", 49990000m, 14 },
                    { 8, 2, "Layout 75% compact, case nhôm CNC 6063 anodized nguyên khối, PCB Double-Gasket mount cách âm vượt trội. Switch Gateron Jupiter Red mượt mà. Đèn RGB South-facing, kết nối Bluetooth 5.1 & Type-C. Hỗ trợ QMK/VIA keymap.", "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80", "Keychron Q1 Pro QMK/VIA Wireless", 4890000m, 30 },
                    { 9, 2, "Layout 96% full phím số siêu mỏng nhẹ 595g. Switch Low-profile Gateron KS-33 Red êm ái. Hỗ trợ QMK/VIA, tần số phản hồi 1000Hz ở chế độ 2.4GHz. Pin dung lượng lớn 4000mAh dùng 300 giờ. Keycap PBT dye-sub cao cấp.", "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80", "Nuphy Air96 v2 Wireless Low Profile", 3290000m, 45 },
                    { 10, 2, "Bàn phím cơ Custom vỏ nhôm CNC thuần khiết nặng 1.95kg, mạch xuôi Hotswap 5-pin. Núm xoay đa phương tiện kim loại sang trọng. Cấu trúc Gasket-mount nhiều lớp foam PORON & IXPE cho âm gõ 'clack' trầm ấm gây nghiện.", "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=600&q=80", "MonsGeek M1 V3 Aluminium QMK", 2650000m, 28 },
                    { 11, 2, "Hiện tượng bàn phím cơ 2024: Vỏ nhôm CNC tinh xảo, tạ đáy gương thép không gỉ. Cấu trúc Gasket mount tối ưu flex-cut mang lại âm thanh 'mưa rơi' (thocky) đỉnh cao ngay khi đập hộp. Kết nối 3 chế độ (Type-C, 2.4G, BT5.0).", "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80", "WOB Rainy 75 CNC Gasket Mount", 2490000m, 35 },
                    { 12, 2, "Kit phím cơ Custom cao cấp của Meletrix. Màn hình LCD 2 inch hiển thị GIF & trạng thái hệ thống. Case nhôm sơn tĩnh điện mịn màng. Cấu trúc Gasket mount lò xo lá cải tiến, Bluetooth 5.0 kết nối mượt mà cùng lúc 3 thiết bị.", "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80", "Meletrix Zoom75 TKL Premium Custom", 5690000m, 12 },
                    { 13, 2, "Bàn phím cơ low-profile êm nhất thế giới với switch Kailh Full-POM tự bôi trơn. Cấu trúc Gasket mount đầu tiên trên phím mỏng. Vỏ nhôm all-metal siêu bền, đèn nền trắng tinh tế & dải LED RGB hông ambient light nghệ thuật.", "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80", "Lofree Flow 84 Low-Profile Smooth", 3850000m, 22 },
                    { 14, 2, "Thiết kế O-ring mount & Gasket mount kép linh hoạt. Khung nhôm vát cạnh tinh tế, tạ đồng PVD bóng gương. Hotswap mạch xuôi per-key RGB, tương thích hoàn toàn QMK/VIA. Kết nối đa năng 2.4Ghz độ trễ siêu thấp.", "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=600&q=80", "Qwertykeys Neo65 Tri-Mode Hotswap", 3150000m, 18 },
                    { 15, 3, "Công nghệ chống ồn chủ động hàng đầu thế giới với 8 micro kép và 2 bộ xử lý chuyên dụng V1 + QN1. Màng loa sợi carbon 30mm cho âm thanh Hi-Res LDAC sắc sảo. Thời lượng pin 30 giờ (bật ANC), sạc nhanh 3 phút được 3 giờ nghe.", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80", "Sony WH-1000XM5 Wireless ANC", 8490000m, 25 },
                    { 16, 3, "Chuột thi đấu eSports nhẹ nhất chỉ 60g. Cảm biến quang học HERO 2 đạt 32.000 DPI, tốc độ quét 500 IPS. Switch lai quang học-cơ học LIGHTFORCE độ bền 100 triệu lần nhấn. Kết nối LIGHTSPEED 2.4GHz tần số quét cực đại 4000Hz.", "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80", "Logitech G Pro X Superlight 2", 2990000m, 50 },
                    { 17, 3, "Màn hình gaming chuyên nghiệp 27\" IPS 4K UHD 144Hz, HDR600 True Black, 98% DCI-P3. Công nghệ bảo vệ mắt Eye-Care độc quyền BenQ. Loa 2.1 kênh treVolo tích hợp subwoofer mạnh mẽ, HDMI 2.1 tương thích trọn vẹn PS5/Xbox Series X.", "https://images.unsplash.com/photo-1527443224154-c4a573d5f5ea?auto=format&fit=crop&w=600&q=80", "BenQ MOBIUZ EX2710U 4K 144Hz", 18990000m, 10 },
                    { 18, 3, "Tai nghe Gaming đẳng cấp số 1: Hệ thống âm thanh Nova Pro Acoustic Hi-Res với GameDAC Gen 2. Chống ồn chủ động ANC 4 micro. Trạm sạc Base Station kép pin thay nóng vô hạn (Infinity Power System), hỗ trợ kết nối đồng thời PC và Bluetooth.", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80", "SteelSeries Arctis Nova Pro Wireless", 9490000m, 14 },
                    { 19, 3, "Chuột thể thao điện tử thiết kế đối xứng siêu nhẹ 54g. Cảm biến Focus Pro 35K Optical Gen-2 chính xác tuyệt đối 99.8%. Tần số phản hồi không dây HyperPolling 8000Hz (0.125ms delay). Feet chuột 100% PTFE di chuyển mượt mà.", "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80", "Razer Viper V3 Pro Wireless 8K", 3990000m, 32 },
                    { 20, 3, "Màn hình Gaming đỉnh cao tấm nền OLED 27\" QHD (2560x1440), tần số quét 240Hz thời gian phản hồi siêu tốc 0.03ms. Độ tương phản vô cực 1.500.000:1, chuẩn màu DCI-P3 98.5%. Đèn viền Hexagon RGB Gaming Lighting mặt lưng sống động.", "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=600&q=80", "LG UltraGear OLED 27GR95QE 240Hz", 19990000m, 8 },
                    { 21, 3, "Microphone thu âm chuyên nghiệp lấy cảm hứng từ huyền thoại SM7B. Kết nối kép USB-C & XLR. Công nghệ cách ly giọng nói Voice Isolation loại bỏ hoàn toàn tạp âm phòng. Bảng điều khiển cảm ứng trực quan chỉnh Gain, Monitor và Mute tức thì.", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80", "Shure MV7 Podcast Microphone XLR/USB", 6890000m, 20 }
                });

            migrationBuilder.InsertData(
                table: "OrderItems",
                columns: new[] { "Id", "OrderId", "ProductId", "Quantity", "UnitPrice" },
                values: new object[,]
                {
                    { 1, 1, 2, 1, 74990000m },
                    { 2, 2, 8, 1, 4890000m },
                    { 3, 3, 16, 1, 2990000m },
                    { 4, 4, 15, 1, 8490000m },
                    { 5, 4, 16, 1, 2990000m }
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}
