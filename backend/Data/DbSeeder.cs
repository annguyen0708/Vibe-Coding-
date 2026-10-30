using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // 1. Ensure Categories 4 & 5 exist
            var categoriesToAdd = new List<Category>
            {
                new Category { Id = 1, Name = "Laptop & Workstation" },
                new Category { Id = 2, Name = "Bàn phím cơ Custom" },
                new Category { Id = 3, Name = "Gaming Gear & Audio" },
                new Category { Id = 4, Name = "Màn hình Gaming & Đồ họa" },
                new Category { Id = 5, Name = "Chuột & Bàn di Gaming" }
            };

            foreach (var cat in categoriesToAdd)
            {
                var existing = await context.Categories.FindAsync(cat.Id);
                if (existing == null)
                {
                    context.Categories.Add(cat);
                }
                else if (existing.Name != cat.Name)
                {
                    existing.Name = cat.Name;
                }
            }
            await context.SaveChangesAsync();

            // 2. Additional 30+ Laptops, 10 Monitors, 10 Mice
            var newProducts = new List<Product>
            {
                // ==================== [30 LAPTOPS CÁC LOẠI (CAT 1)] ====================
                new Product
                {
                    Name = "Apple MacBook Air 13\" M3 (16GB / 256GB)",
                    Description = "Siêu phẩm cho sinh viên Marketing & Doanh nhân. Chip Apple M3 8-core CPU 10-core GPU, RAM 16GB, SSD 256GB. Màn Liquid Retina 13.6\" rực rỡ, mỏng nhẹ 1.24kg, pin trâu 18 giờ. Màu Starlight sang trọng.",
                    Price = 27990000m,
                    StockQuantity = 20,
                    ImageUrl = "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Apple MacBook Air 15\" M3 (16GB / 512GB)",
                    Description = "Màn hình lớn 15.3\" Liquid Retina chuẩn màu, mỏng 1.15cm, nặng 1.5kg. Chip Apple M3 mạnh mẽ, RAM 16GB, SSD 512GB. Âm thanh 6 loa Spatial Audio đỉnh cao, lý tưởng cho sinh viên thuyết trình & sáng tạo nội dung.",
                    Price = 37990000m,
                    StockQuantity = 15,
                    ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Apple MacBook Pro 14\" M3 Pro (18GB / 512GB)",
                    Description = "Chip Apple M3 Pro 11-core CPU, 14-core GPU. RAM 18GB Unified, SSD 512GB. Màn Liquid Retina XDR 120Hz ProMotion, HDMI, khe thẻ nhớ SD. Hoàn hảo cho Lập trình viên iOS/Web và Dựng video 4K chuyên nghiệp.",
                    Price = 49990000m,
                    StockQuantity = 12,
                    ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "ASUS Zenbook 14 OLED UX3405",
                    Description = "Chuẩn doanh nhân thời trang. Intel Core Ultra 7 155H tích hợp NPU AI, RAM 32GB LPDDR5X, SSD 1TB. Màn hình 14\" 3K 120Hz Lumina OLED chuẩn màu 100% DCI-P3. Khung nhôm nguyên khối siêu nhẹ 1.2kg, pin 75Wh.",
                    Price = 31990000m,
                    StockQuantity = 18,
                    ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "ASUS Vivobook 15 OLED A1505",
                    Description = "Laptop sinh viên màn OLED đỉnh nhất phân khúc. AMD Ryzen 5 7530U 6 nhân 12 luồng, RAM 16GB, SSD 512GB. Màn hình 15.6\" OLED FHD 100% DCI-P3 rực rỡ, bản lề mở 180 độ, bảo mật vân tay 1 chạm.",
                    Price = 14990000m,
                    StockQuantity = 25,
                    ImageUrl = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "ASUS TUF Gaming A15 FA507 (2024)",
                    Description = "Chiến thần gaming bền bỉ chuẩn quân đội. AMD Ryzen 7 7735HS, NVIDIA GeForce RTX 4060 8GB TGP 140W. RAM 16GB DDR5, SSD 512GB PCIe 4.0. Màn hình 15.6\" FHD 144Hz 100% sRGB G-Sync. Pin khủng 90Wh.",
                    Price = 24990000m,
                    StockQuantity = 22,
                    ImageUrl = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "ASUS ROG Strix SCAR 16 (2024) Mini LED",
                    Description = "Cỗ máy Gaming eSports tối thượng. Intel Core i9-14900HX, RTX 4080 12GB TGP 175W. RAM 32GB DDR5 5600MHz, SSD 1TB. Màn hình ROG Nebula HDR Mini LED 2.5K 240Hz 1100 nits. Tản nhiệt kim loại lỏng 3 quạt.",
                    Price = 78990000m,
                    StockQuantity = 8,
                    ImageUrl = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "ASUS ROG Flow Z13 (2024) Tablet Gaming",
                    Description = "Máy tính bảng Gaming mạnh nhất hành tinh. Intel Core i9-13900H, RTX 4060 8GB. RAM 16GB, SSD 1TB. Màn hình cảm ứng ROG Nebula 13.4\" QHD+ 165Hz. Bàn phím LED RGB tháo rời, trọng lượng chỉ 1.18kg.",
                    Price = 49990000m,
                    StockQuantity = 10,
                    ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Lenovo LOQ 15IAX9 (2024)",
                    Description = "Laptop gaming quốc dân cho sinh viên. Intel Core i5-12450HX, RTX 4050 6GB GDDR6. RAM 16GB DDR5 4800MHz, SSD 512GB NVMe. Màn hình 15.6\" FHD 144Hz 100% sRGB G-Sync. Thiết kế hầm hố chuẩn Legion.",
                    Price = 19990000m,
                    StockQuantity = 30,
                    ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Lenovo Legion 5 Slim (2024)",
                    Description = "Gaming mỏng nhẹ hiệu năng cao. AMD Ryzen 7 7840HS 8 nhân 16 luồng, RTX 4060 8GB. RAM 16GB DDR5, SSD 512GB. Màn hình 16\" WQXGA (2560x1600) 165Hz 100% sRGB 350 nits. Khung nhôm tản nhiệt Coldfront 5.0.",
                    Price = 34990000m,
                    StockQuantity = 14,
                    ImageUrl = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Lenovo ThinkPad E14 Gen 5",
                    Description = "Lựa chọn số 1 cho sinh viên CNTT & Kế toán kinh tế. AMD Ryzen 5 7530U, RAM 16GB DDR4, SSD 512GB. Màn hình 14\" IPS WUXGA chống chói. Bàn phím ThinkPad gõ êm vô địch, độ bền quân đội MIL-STD 810H.",
                    Price = 15490000m,
                    StockQuantity = 22,
                    ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Lenovo IdeaPad Slim 3 14IAH8",
                    Description = "Laptop học tập giá rẻ cấu hình cao. Intel Core i5-12450H 8 nhân 12 luồng dòng H mạnh mẽ, RAM 16GB LPDDR5, SSD 512GB. Màn hình 14\" FHD IPS, mỏng nhẹ 1.37kg, sạc nhanh Rapid Charge 15 phút dùng 2 giờ.",
                    Price = 13490000m,
                    StockQuantity = 35,
                    ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Lenovo Yoga Slim 7 ProX",
                    Description = "Đẳng cấp mỏng nhẹ cho Creator & Designer. AMD Ryzen 7 6800HS Creator Edition, GPU rời NVIDIA RTX 3050 4GB. RAM 16GB, SSD 1TB. Màn hình PureSight 14.5\" 3K 120Hz 100% sRGB cảm ứng. Khung nhôm CNC sang xịn.",
                    Price = 26990000m,
                    StockQuantity = 12,
                    ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Acer Nitro 16 Phoenix",
                    Description = "Chiến thần gaming tản nhiệt kim loại lỏng. AMD Ryzen 7 7840HS, RTX 4050 6GB TGP 140W max công suất. RAM 16GB DDR5, SSD 512GB. Màn hình 16\" 165Hz 100% sRGB chuẩn màu, đèn nền RGB 4 vùng.",
                    Price = 26490000m,
                    StockQuantity = 18,
                    ImageUrl = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Acer Swift Go 14 AI OLED",
                    Description = "Laptop tích hợp AI siêu nhẹ cho sinh viên MKT & Văn phòng. Intel Core Ultra 5 125H NPU Intel AI Boost, RAM 16GB LPDDR5X, SSD 512GB. Màn hình 14\" OLED 2.8K 90Hz 100% DCI-P3, camera 1440p khử ồn AI.",
                    Price = 21990000m,
                    StockQuantity = 16,
                    ImageUrl = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Acer Aspire 5 A515",
                    Description = "Bền bỉ thực dụng cho sinh viên & nhân viên văn phòng. Intel Core i5-1335U 10 nhân 12 luồng, RAM 16GB nâng cấp thoải mái, SSD 512GB. Màn hình 15.6\" FHD IPS viền mỏng, bàn phím số full-size tiện gõ Excel.",
                    Price = 13990000m,
                    StockQuantity = 28,
                    ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Dell Inspiron 14 5430",
                    Description = "Thiết kế kim loại cao cấp sang trọng. Intel Core i5-1335U, RAM 16GB LPDDR5, SSD 512GB PCIe. Màn hình 14\" FHD+ tỉ lệ 16:10 hiển thị rộng rãi, loa Waves MaxxAudio Pro, đèn nền phím làm việc ban đêm.",
                    Price = 16990000m,
                    StockQuantity = 20,
                    ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Dell Alienware m16 R2",
                    Description = "Huyền thoại Gaming ngoài hành tinh Alienware. Intel Core Ultra 7 155H, RTX 4070 8GB GDDR6. RAM 16GB DDR5 5600MHz, SSD 1TB. Màn hình 16\" QHD+ 240Hz 100% sRGB 3ms. Tản nhiệt Cryo-tech độc quyền.",
                    Price = 59990000m,
                    StockQuantity = 6,
                    ImageUrl = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Dell Latitude 3440",
                    Description = "Chuẩn doanh nghiệp độ bền cao. Intel Core i5-1335U, RAM 16GB, SSD 512GB. Màn hình 14\" FHD chống lóa, cảm biến vân tay tích hợp nút nguồn, camera màn che trập bảo mật riêng tư, pin dùng cả ngày.",
                    Price = 15890000m,
                    StockQuantity = 19,
                    ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "HP Victus 16 (2024)",
                    Description = "Gaming thanh lịch tinh tế. AMD Ryzen 7 7840HS, RTX 4060 8GB TGP 120W. RAM 16GB DDR5, SSD 512GB PCIe Gen4. Màn hình 16.1\" FHD 144Hz viền siêu mỏng, tản nhiệt OMEN Gaming Hub tùy chỉnh chế độ quạt.",
                    Price = 25990000m,
                    StockQuantity = 17,
                    ImageUrl = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "HP Omen 16 Transcend Mini LED",
                    Description = "Flagship Gaming siêu phẩm của HP. Intel Core i9-13900HX, RTX 4070 8GB 140W. RAM 32GB DDR5, SSD 1TB. Màn hình Mini LED 16\" 240Hz HDR 1000 nits cực sáng. Thiết kế khung nhôm mỏng nhẹ chỉ 2.1kg.",
                    Price = 52990000m,
                    StockQuantity = 7,
                    ImageUrl = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "HP Envy 16 OLED",
                    Description = "Trạm sáng tạo cho Designer & Video Editor. Intel Core i7-13700H, RTX 4060 8GB Studio Driver. RAM 16GB DDR5, SSD 1TB. Màn hình OLED 16\" 4K UHD+ 120Hz 100% DCI-P3 cảm ứng đa điểm, loa Bang & Olufsen.",
                    Price = 44990000m,
                    StockQuantity = 9,
                    ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "HP Pavilion 15 (Gold Edition)",
                    Description = "Thời trang thanh lịch cho sinh viên Marketing & Kinh tế. Intel Core i5-1335U, RAM 16GB, SSD 512GB. Màn hình 15.6\" FHD IPS viền mỏng, vỏ nhôm màu vàng Gold sang chảnh, bàn phím số đầy đủ.",
                    Price = 16490000m,
                    StockQuantity = 24,
                    ImageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "MSI Katana 15 B13V",
                    Description = "Lưỡi kiếm sắc bén cho game thủ. Intel Core i7-13620H 10 nhân 16 luồng, RTX 4060 8GB. RAM 16GB DDR5 5200MHz, SSD 1TB NVMe. Màn hình 15.6\" 144Hz IPS, tản nhiệt Cooler Boost 5 quạt kép 6 ống đồng.",
                    Price = 27990000m,
                    StockQuantity = 15,
                    ImageUrl = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "MSI Titan 18 HX A14V",
                    Description = "Quái vật Gaming mạnh nhất vũ trụ. Intel Core i9-14900HX, NVIDIA GeForce RTX 4090 16GB TGP 175W. RAM 64GB DDR5, SSD 4TB NVMe PCIe 5.0. Màn hình 18\" 4K 120Hz Mini LED. Bàn phím cơ Cherry MX tích hợp.",
                    Price = 149990000m,
                    StockQuantity = 3,
                    ImageUrl = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "MSI Modern 14 C12M",
                    Description = "Laptop sinh viên mỏng nhẹ giá sinh viên nhất. Intel Core i5-1235U, RAM 16GB, SSD 512GB. Màn hình 14\" FHD IPS, trọng lượng chỉ 1.4kg, bản lề mở 180 độ, chứng nhận độ bền chuẩn quân đội Mỹ.",
                    Price = 12990000m,
                    StockQuantity = 40,
                    ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "MSI Stealth 16 Mercedes-AMG Motorsport",
                    Description = "Phiên bản giới hạn siêu xe Mercedes-AMG. Intel Core i9-13900H, RTX 4070 8GB. RAM 32GB, SSD 2TB. Màn hình OLED 16\" 4K UHD+ 100% DCI-P3. Vỏ hợp kim Magie - Nhôm siêu nhẹ 1.88kg, logo AMG khắc laser tinh tế.",
                    Price = 79990000m,
                    StockQuantity = 4,
                    ImageUrl = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Gigabyte G5 KF5 (RTX 4060)",
                    Description = "Chiếc laptop trang bị RTX 4060 rẻ nhất thị trường. Intel Core i7-13620H, RTX 4060 8GB GDDR6. RAM 16GB DDR5, SSD 512GB PCIe 4.0. Màn hình 15.6\" 144Hz FHD viền mỏng. Cân mượt mọi game AAA ở thiết lập đồ họa cao.",
                    Price = 22490000m,
                    StockQuantity = 25,
                    ImageUrl = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Gigabyte AORUS 16X (2024)",
                    Description = "Laptop Gaming AI tích hợp. Intel Core i7-14650HX, RTX 4070 8GB. RAM 16GB DDR5, SSD 1TB. Màn hình 16\" WQXGA 165Hz 100% sRGB Pantone Validated. Tản nhiệt WINDFORCE Infinity 4 ống đồng lớn.",
                    Price = 41990000m,
                    StockQuantity = 11,
                    ImageUrl = "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },
                new Product
                {
                    Name = "Razer Blade 14 (2024) Mercury White",
                    Description = "Vẻ đẹp thuần khiết màu trắng Mercury. AMD Ryzen 9 8945HS tích hợp AI Ryzen NPU, RTX 4070 8GB 140W. RAM 32GB DDR5 5600MHz, SSD 1TB. Màn hình 14\" QHD+ 240Hz 100% DCI-P3. Khung nhôm CNC nguyên khối chỉ 1.84kg.",
                    Price = 69990000m,
                    StockQuantity = 5,
                    ImageUrl = "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 1
                },

                // ==================== [10 MÀN HÌNH GAMING & ĐỒ HỌA (CAT 4)] ====================
                new Product
                {
                    Name = "Màn hình Gaming LG UltraGear 27GR95QE OLED 240Hz",
                    Description = "Màn hình Gaming số 1 thế giới. Tấm nền OLED 27 inch độ phân giải 2K QHD (2560x1440), tần số quét 240Hz siêu tốc, thời gian đáp ứng vô địch 0.03ms (GtG). Tương thích G-Sync, FreeSync Premium, 98.5% DCI-P3.",
                    Price = 18990000m,
                    StockQuantity = 15,
                    ImageUrl = "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 4
                },
                new Product
                {
                    Name = "Màn hình Gaming ASUS ROG Swift OLED PG27AQDM 2K 240Hz",
                    Description = "Đỉnh cao eSports. Tấm nền OLED 27\" 2K 240Hz 0.03ms, hệ thống tản nhiệt buồng hơi độc quyền giúp giảm 5% nhiệt độ màn hình. Độ sáng 1000 nits, chuẩn màu 99% DCI-P3, Delta E < 2 cho cả đồ họa chuyên nghiệp.",
                    Price = 23490000m,
                    StockQuantity = 8,
                    ImageUrl = "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 4
                },
                new Product
                {
                    Name = "Màn hình Samsung Odyssey OLED G9 49\" Cong 240Hz",
                    Description = "Màn hình cong khổng lồ 49 inch tỉ lệ 32:9 siêu rộng (tương đương 2 màn 27\" ghép lại). Độ phân giải Dual QHD 5120x1440, OLED 240Hz 0.03ms, bộ xử lý Neo Quantum Processor Pro, thiết kế kim loại mỏng 4.5mm.",
                    Price = 32990000m,
                    StockQuantity = 6,
                    ImageUrl = "https://images.unsplash.com/photo-1551645120-d70bfe84c826?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 4
                },
                new Product
                {
                    Name = "Màn hình Dell UltraSharp U2724D 27\" 2K 120Hz IPS Black",
                    Description = "Chuẩn mực đồ họa của thế giới. Tấm nền IPS Black độ tương phản 2000:1, tần số quét nâng cấp 120Hz mượt mà. 98% DCI-P3, 100% sRGB, cảm biến ánh sáng tự động điều chỉnh độ sáng, cổng kết nối đa dạng.",
                    Price = 10490000m,
                    StockQuantity = 25,
                    ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 4
                },
                new Product
                {
                    Name = "Màn hình Gaming ViewSonic VX2728-2K 180Hz Fast IPS",
                    Description = "Màn hình 2K 180Hz giá tốt nhất thị trường. Kích thước 27\", tấm nền Fast IPS 0.5ms MPRT, chuẩn màu 100% sRGB, hỗ trợ HDR10, AMD FreeSync Premium. Lựa chọn hoàn hảo cho game thủ học sinh sinh viên.",
                    Price = 4990000m,
                    StockQuantity = 35,
                    ImageUrl = "https://images.unsplash.com/photo-1585792180666-f75a7c4f1c95?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 4
                },
                new Product
                {
                    Name = "Màn hình Gaming GIGABYTE M27Q 27\" 2K 170Hz KVM",
                    Description = "Tích hợp tính năng KVM chuyển đổi chuột phím giữa 2 máy tính cực tiện lợi. Kích thước 27\" SuperSpeed IPS 2K 170Hz 0.5ms. 92% DCI-P3, DisplayHDR 400, chân đế công thái học nâng hạ linh hoạt.",
                    Price = 6890000m,
                    StockQuantity = 20,
                    ImageUrl = "https://images.unsplash.com/photo-1586210579191-33b45e38fa2c?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 4
                },
                new Product
                {
                    Name = "Màn hình Gaming MSI MAG 274QRF QD E2 2K 180Hz",
                    Description = "Công nghệ chấm lượng tử Quantum Dot cho màu sắc sống động vượt trội. Màn hình 27\" Rapid IPS 180Hz 1ms, 98% Adobe RGB, 94% DCI-P3. Cổng Type-C sạc 65W cho laptop, chân đế xoay 90 độ.",
                    Price = 7490000m,
                    StockQuantity = 18,
                    ImageUrl = "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 4
                },
                new Product
                {
                    Name = "Màn hình Dell UltraSharp U3224KB 32\" 6K IPS Black",
                    Description = "Màn hình 6K đầu tiên trên thế giới tích hợp Camera 4K HDR. Độ phân giải 6144 x 3456 siêu sắc nét, IPS Black, 99% DCI-P3, cổng Thunderbolt 4 sạc 140W. Dành cho các studio đồ họa và chuyên gia dựng phim điện ảnh.",
                    Price = 59990000m,
                    StockQuantity = 4,
                    ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 4
                },
                new Product
                {
                    Name = "Màn hình Cong Gaming AOC CQ27G3S 27\" 2K 165Hz",
                    Description = "Độ cong hoàn hảo 1000R ôm trọn tầm nhìn mắt người. Kích thước 27\" độ phân giải 2K 2560x1440, 165Hz 1ms. Tấm nền VA tương phản cao 3000:1 màu đen sâu thẳm, công nghệ chống xé hình FreeSync Premium.",
                    Price = 4590000m,
                    StockQuantity = 22,
                    ImageUrl = "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 4
                },
                new Product
                {
                    Name = "Màn hình Gaming ASUS TUF Gaming VG249Q3A 24\" 180Hz",
                    Description = "Màn hình quốc dân cho game thủ FPS CS2 & Valorant. Kích thước 23.8\" Fast IPS FHD 180Hz 1ms (GtG). Công nghệ khử nhòe ELMB Sync độc quyền, 99% sRGB, giá cực kỳ hợp túi tiền học sinh sinh viên.",
                    Price = 3290000m,
                    StockQuantity = 40,
                    ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 4
                },

                // ==================== [10 CHUỘT GAMING & PHỤ KIỆN (CAT 5)] ====================
                new Product
                {
                    Name = "Chuột không dây Logitech G502 X PLUS LIGHTSPEED RGB",
                    Description = "Huyền thoại tái sinh. Switch lai quang - cơ LIGHTFORCE siêu nhạy, cảm biến HERO 25K chính xác từng pixel. Đèn nền RGB 8 vùng LIGHTSYNC, con lăn siêu tốc 2 chế độ, kết nối không dây LIGHTSPEED siêu ổn định.",
                    Price = 3590000m,
                    StockQuantity = 25,
                    ImageUrl = "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 5
                },
                new Product
                {
                    Name = "Chuột Gaming Razer DeathAdder V3 Pro Wireless 63g",
                    Description = "Vũ khí công thái học eSports hàng đầu thế giới. Trọng lượng siêu nhẹ chỉ 63g, cảm biến quang học Focus Pro 30K DPI, switch quang học Gen-3 90 triệu lần bấm. Hỗ trợ Polling rate 4000Hz - 8000Hz không độ trễ.",
                    Price = 3290000m,
                    StockQuantity = 30,
                    ImageUrl = "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 5
                },
                new Product
                {
                    Name = "Chuột Gaming Pulsar X2V2 Wireless Mini 51g",
                    Description = "Chuột thi đấu siêu nhẹ chỉ 51g không đục lỗ. Cảm biến PixArt PAW3395 26.000 DPI, switch quang học chống double-click, bộ mã hóa Pulsar Blue Encoder nảy đầm tay. Thiết kế đối xứng cho kiểu cầm Claw Grip & Fingertip.",
                    Price = 2190000m,
                    StockQuantity = 20,
                    ImageUrl = "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 5
                },
                new Product
                {
                    Name = "Chuột Gaming Lamzu Atlantis OG V2 4K Charcoal",
                    Description = "Siêu phẩm chuột eSports được cộng đồng game thủ FPS săn đón. Hỗ trợ tần số quét 4000Hz (4K Polling Rate), cảm biến PAW3395, switch Huano Blue Shell Pink Dot nảy giòn tan. Trọng lượng chỉ 57g mượt mà.",
                    Price = 2390000m,
                    StockQuantity = 18,
                    ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 5
                },
                new Product
                {
                    Name = "Chuột Gaming Ninjutso Sora V2 Wireless 39g",
                    Description = "Chuột gaming không dây nhẹ nhất thế giới không đục lỗ: CHỈ 39 GRAM! Vỏ polycarbonate cao cấp siêu mỏng, cảm biến PAW3395, switch quang học SnappyFire, hỗ trợ polling rate không dây 8000Hz đỉnh cao.",
                    Price = 2690000m,
                    StockQuantity = 12,
                    ImageUrl = "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 5
                },
                new Product
                {
                    Name = "Chuột công thái học Logitech MX Master 3S",
                    Description = "Vua chuột văn phòng & thiết kế đồ họa. Con lăn điện từ MagSpeed cuộn 1000 dòng/giây, click tĩnh âm Quiet Clicks êm hơn 90%, cảm biến 8000 DPI di chuyển trên kính. Kết nối 3 thiết bị và Flow chuyển file giữa Mac & Windows.",
                    Price = 2190000m,
                    StockQuantity = 35,
                    ImageUrl = "https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 5
                },
                new Product
                {
                    Name = "Chuột Gaming Zowie EC2-CW Wireless eSports",
                    Description = "Tiêu chuẩn thi đấu Counter-Strike và Valorant chuyên nghiệp. Thiết kế công thái học huyền thoại của BenQ Zowie, trạm thu phát sóng độc lập chống nhiễu 2.4GHz không gián đoạn, cảm biến 3370 điều chỉnh trực tiếp không cần driver.",
                    Price = 3890000m,
                    StockQuantity = 10,
                    ImageUrl = "https://images.unsplash.com/photo-1613141411244-0e4ac259d217?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 5
                },
                new Product
                {
                    Name = "Chuột Gaming ASUS ROG Keris II Ace 54g",
                    Description = "Trọng lượng siêu nhẹ 54g được tối ưu bởi các game thủ FPS chuyên nghiệp. Cảm biến quang học ROG AimPoint Pro 42.000 DPI, switch vi mô quang học ROG 100 triệu lượt bấm, hỗ trợ polling rate không dây 4000Hz.",
                    Price = 3490000m,
                    StockQuantity = 15,
                    ImageUrl = "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 5
                },
                new Product
                {
                    Name = "Chuột Gaming SteelSeries Aerox 3 Wireless Snow",
                    Description = "Thiết kế tổ ong siêu nhẹ 68g với khả năng chống nước và bụi bẩn chuẩn IP54 AquaBarrier. Cảm biến TrueMove Air, thời lượng pin 200 giờ qua Bluetooth và 2.4GHz Quantum 2.0, đèn LED RGB 3 vùng đẹp mắt.",
                    Price = 1890000m,
                    StockQuantity = 22,
                    ImageUrl = "https://images.unsplash.com/photo-1541140532154-b024d705b909?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 5
                },
                new Product
                {
                    Name = "Chuột Gaming DareU EM901X RGB Kèm Dock Sạc",
                    Description = "Chuột không dây quốc dân kèm dock sạc RGB tiện lợi. Trọng lượng 85g vừa tay, cảm biến Bravo ATG4090 độ nhạy cao, pin 930mAh dùng liên tục 40 giờ. Đặt lên dock tự hít sạc từ tính cực ngầu.",
                    Price = 590000m,
                    StockQuantity = 50,
                    ImageUrl = "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
                    CategoryId = 5
                }
            };

            foreach (var p in newProducts)
            {
                var existing = await context.Products.FirstOrDefaultAsync(x => x.Name == p.Name);
                if (existing == null)
                {
                    context.Products.Add(p);
                }
                else
                {
                    existing.ImageUrl = p.ImageUrl;
                    existing.Description = p.Description;
                    existing.Price = p.Price;
                    existing.CategoryId = p.CategoryId;
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
