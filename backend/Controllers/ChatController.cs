using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using backend.Data;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public ChatController(AppDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _context = context;
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        // POST /api/chat
        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] ChatRequestDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest(new { message = "Tin nhắn không được trống." });

            var allProducts = await _context.Products
                .Include(p => p.Category)
                .Where(p => p.StockQuantity > 0)
                .Select(p => new
                {
                    p.Id,
                    p.CategoryId,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    CategoryName = p.Category != null ? p.Category.Name : ""
                })
                .ToListAsync();

            string replyMessage = string.Empty;
            List<int> suggestedIds = new List<int>();
            bool geminiSuccess = false;

            // Kiểm tra Gemini API Key nếu người dùng cấu hình
            var apiKey = _configuration["Gemini:ApiKey"];
            if (string.IsNullOrWhiteSpace(apiKey))
            {
                apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");
            }

            if (!string.IsNullOrWhiteSpace(apiKey))
            {
                try
                {
                    var productCatalog = new StringBuilder();
                    foreach (var p in allProducts)
                    {
                        productCatalog.AppendLine($"[ID: {p.Id}] {p.Name} | {p.CategoryName} | Giá: {p.Price:N0} VNĐ | Mô tả: {p.Description}");
                    }

                    var systemPrompt = $@"Bạn là GearVN AI Assistant - Chuyên gia tư vấn phần cứng và laptop hàng đầu của hệ thống GEARVN.
MỤC TIÊU:
- Trả lời ĐÚNG TRỌNG TÂM câu hỏi của khách hàng (Ví dụ: sinh viên marketing thì tư vấn máy mỏng nhẹ, pin trâu, màn chuẩn màu Canva/CapCut; sinh viên CNTT thì tư vấn CPU/RAM máy ảo; game thủ thì GPU...).
- BẮT BUỘC chỉ trả về duy nhất chuỗi JSON:
{{
  ""reply"": ""Nội dung tư vấn chi tiết cho khách hàng bằng tiếng Việt..."",
  ""suggestedProductIds"": [1, 2]
}}

KHO HÀNG GEARVN:
{productCatalog}";

                    var geminiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";
                    var requestBody = new
                    {
                        contents = new[]
                        {
                            new
                            {
                                role = "user",
                                parts = new[] { new { text = systemPrompt + "\n\nKhách hàng hỏi: " + request.Message } }
                            }
                        },
                        generationConfig = new
                        {
                            temperature = 0.7,
                            maxOutputTokens = 1024
                        }
                    };

                    var httpClient = _httpClientFactory.CreateClient();
                    httpClient.Timeout = TimeSpan.FromSeconds(8);
                    var json = JsonSerializer.Serialize(requestBody);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    var response = await httpClient.PostAsync(geminiUrl, content);
                    if (response.IsSuccessStatusCode)
                    {
                        var responseBody = await response.Content.ReadAsStringAsync();
                        using var doc = JsonDocument.Parse(responseBody);
                        var rawText = doc.RootElement
                            .GetProperty("candidates")[0]
                            .GetProperty("content")
                            .GetProperty("parts")[0]
                            .GetProperty("text")
                            .GetString();

                        if (!string.IsNullOrWhiteSpace(rawText))
                        {
                            var match = Regex.Match(rawText, @"\{[\s\S]*\}");
                            if (match.Success)
                            {
                                using var parsed = JsonDocument.Parse(match.Value);
                                if (parsed.RootElement.TryGetProperty("reply", out var replyElem))
                                    replyMessage = replyElem.GetString() ?? "";

                                if (parsed.RootElement.TryGetProperty("suggestedProductIds", out var idsElem) && idsElem.ValueKind == JsonValueKind.Array)
                                {
                                    foreach (var item in idsElem.EnumerateArray())
                                    {
                                        if (item.TryGetInt32(out int idVal) && allProducts.Any(p => p.Id == idVal))
                                            suggestedIds.Add(idVal);
                                    }
                                }

                                if (!string.IsNullOrWhiteSpace(replyMessage) && suggestedIds.Any())
                                    geminiSuccess = true;
                            }
                        }
                    }
                }
                catch
                {
                    geminiSuccess = false;
                }
            }

            // =========================================================================
            // BỘ NÃO TƯ VẤN NGỮ NGHĨA CHUYÊN GIA GEARVN (ĐÁP ỨNG MỌI CÂU HỎI CHUẨN XÁC)
            // =========================================================================
            if (!geminiSuccess || string.IsNullOrWhiteSpace(replyMessage))
            {
                var lower = request.Message.ToLower();

                // 1. SINH VIÊN MARKETING / MKT / TRUYỀN THÔNG / BÁO CHÍ / KINH DOANH / XÃ HỘI
                if (lower.Contains("mkt") || lower.Contains("marketing") || lower.Contains("truyền thông") ||
                    lower.Contains("báo chí") || lower.Contains("quảng cáo") || lower.Contains("content") ||
                    lower.Contains("social") || lower.Contains("ads") || lower.Contains("pr") || lower.Contains("kinh tế") ||
                    lower.Contains("quản trị") || lower.Contains("thương mại") || lower.Contains("ngoại thương"))
                {
                    replyMessage = @"👋 Chào bạn! Đối với **sinh viên ngành Marketing (MKT / Truyền thông / Kinh tế)**, tính chất học tập yêu cầu máy tính cần đáp ứng các yếu tố sau:

1. **Thiết kế mỏng nhẹ & Thời trang**: Dưới 1.5kg để dễ dàng mang đi học, làm việc nhóm ở quán cafe hay đi pitching dự án.
2. **Thời lượng pin ấn tượng (10h - 22h)**: Đảm bảo hoạt động cả ngày dài mà không cần kè kè cục sạc.
3. **Màn hình hiển thị chuẩn màu (100% sRGB / DCI-P3)**: Cực kỳ quan trọng để thiết kế slide thuyết trình, poster trên Canva, chỉnh sửa ảnh Photoshop hay dựng video ngắn TikTok/Reels trên CapCut, Premiere.
4. **RAM từ 16GB**: Giúp mở cùng lúc 30-40 tab Chrome nghiên cứu thị trường, theo dõi số liệu Google Analytics, Facebook Ads mà không bị tải lại trang.

👉 **Top 3 dòng máy hoàn hảo nhất cho sinh viên Marketing tại GearVN:**";

                    // Gợi ý MacBook Pro 16 M3 Max (ID 1), ThinkPad X1 Carbon (ID 4), Dell XPS 15 (ID 3)
                    suggestedIds = new List<int> { 1, 4, 3 };
                }
                // 2. SINH VIÊN CÔNG NGHỆ THÔNG TIN / CNTT / LẬP TRÌNH / CODE / PHẦN MỀM / KHOA HỌC MÁY TÍNH
                else if (lower.Contains("công nghệ thông tin") || lower.Contains("cntt") || lower.Contains("lập trình") ||
                         lower.Contains("code") || lower.Contains("coder") || lower.Contains("developer") ||
                         lower.Contains("phần mềm") || lower.Contains("khoa học máy tính") || lower.Contains("học it") ||
                         lower.Contains("học code") || lower.Contains("visual studio") || lower.Contains("docker"))
                {
                    replyMessage = @"👋 Chào bạn! Với **sinh viên ngành Công nghệ Thông tin (CNTT/Lập trình viên)**, việc chọn máy tính cần đặc biệt ưu tiên các tiêu chí sau:

1. **CPU đa nhân hiệu năng cao**: Tối thiểu Core i7 / Ultra 7 hoặc Apple Silicon (M3/M2) để biên dịch (compile) mã nguồn, chạy mượt mà nhiều tác vụ nặng.
2. **RAM tối thiểu 16GB - 32GB**: CỰC KỲ QUAN TRỌNG khi mở cùng lúc nhiều IDE (Visual Studio, VS Code, IntelliJ, Android Studio) và chạy máy ảo / Docker containers.
3. **Bàn phím & Màn hình chuẩn**: Bàn phím hành trình sâu, gõ nảy để code hàng giờ không mỏi tay; màn hình sắc nét chống chói để bảo vệ mắt khi làm việc ban đêm.
4. **Thời lượng pin & Trọng lượng**: Cần đủ trâu và gọn nhẹ để tiện mang lên giảng đường, thư viện hoặc làm việc nhóm.

👉 **GearVN xin gợi ý 3 mẫu máy tối ưu và đáng mua nhất cho sinh viên CNTT:**";

                    // Gợi ý MacBook Pro 16 M3 Max (ID 1), ThinkPad X1 Carbon (ID 4), ASUS ROG Zephyrus G16 (ID 2)
                    suggestedIds = new List<int> { 1, 4, 2 };
                }
                // 3. THIẾT KẾ ĐỒ HỌA / 3D / RENDER / DỰNG PHIM / KIẾN TRÚC / PHOTOSHOP / PREMIERE
                else if (lower.Contains("đồ họa") || lower.Contains("thiết kế") || lower.Contains("render") ||
                         lower.Contains("dựng phim") || lower.Contains("video") || lower.Contains("kiến trúc") ||
                         lower.Contains("photoshop") || lower.Contains("premiere") || lower.Contains("3d") ||
                         lower.Contains("blender") || lower.Contains("autocad") || lower.Contains("illustrator"))
                {
                    replyMessage = @"🎨 Chào bạn! Đối với công việc **Thiết kế Đồ họa, Dựng phim 4K & Render 3D**, bạn sẽ cần:

1. **Màn hình chuẩn màu sắc**: Tối thiểu 100% sRGB hoặc 100% DCI-P3, độ sáng cao và độ lệch màu Delta E < 2 để sản phẩm in ấn / xuất video chính xác tuyệt đối.
2. **Card đồ họa chuyên dụng (GPU RTX/Apple GPU)**: Tối ưu tăng tốc xử lý qua CUDA Cores trong Premiere, After Effects, Blender hay Lumion.
3. **Bộ nhớ RAM từ 32GB & SSD NVMe**: Giúp import/export file project dung lượng lớn mà không bị nghẽn cổ chai.

👉 **Top 3 dòng máy đồ họa đỉnh nhất hiện có tại GearVN:**";

                    // Dell XPS 15 OLED (ID 3), MacBook Pro 16 (ID 1), ROG Zephyrus G16 (ID 2)
                    suggestedIds = new List<int> { 3, 1, 2 };
                }
                // 4. KẾ TOÁN / TÀI CHÍNH / NGÂN HÀNG / VĂN PHÒNG / EXCEL
                else if (lower.Contains("kế toán") || lower.Contains("tài chính") || lower.Contains("ngân hàng") ||
                         lower.Contains("kiểm toán") || lower.Contains("excel") || lower.Contains("văn phòng") ||
                         lower.Contains("office") || lower.Contains("word") || lower.Contains("hành chính"))
                {
                    replyMessage = @"📊 Chào bạn! Với chuyên ngành **Kế toán, Tài chính, Ngân hàng & Công việc Văn phòng**:

• **Bàn phím gõ êm & Nảy tốt**: Bạn thường xuyên nhập liệu hàng nghìn dòng Excel, chứng từ nên bàn phím là tiêu chí số 1.
• **CPU mượt mà & Ổn định**: Giúp mở các file Excel dữ liệu lớn, chạy macro, SPSS, PowerBI mượt mà không bị treo máy.
• **Độ bền cao & Màn hình bảo vệ mắt**: Giảm mỏi mắt khi đối chiếu hóa đơn, chứng từ liên tục nhiều giờ.

👉 **Các mẫu laptop văn phòng - tài chính bền bỉ hàng đầu tại GearVN:**";

                    // ThinkPad X1 Carbon (ID 4), Dell XPS 15 (ID 3), MacBook Pro (ID 1)
                    suggestedIds = new List<int> { 4, 3, 1 };
                }
                // 5. SINH VIÊN / HỌC SINH NÓI CHUNG (KHI CHƯA RÕ CHUYÊN NGÀNH)
                else if (lower.Contains("sinh viên") || lower.Contains("học sinh") || lower.Contains("đại học") ||
                         lower.Contains("học tập") || lower.Contains("đi học"))
                {
                    replyMessage = @"🎓 Chào bạn! Nếu bạn đang là **Học sinh - Sinh viên**, việc lựa chọn laptop phụ thuộc nhiều vào nhóm ngành bạn theo học:

• **Khối Kinh tế / Marketing / Xã hội**: Ưu tiên mỏng nhẹ, pin trâu từ 12-20h, màn hình đẹp để làm slide, thuyết trình.
• **Khối Công nghệ / Kỹ thuật (CNTT, Cơ điện tử)**: Cần chip CPU mạnh mẽ, tối thiểu 16GB-32GB RAM để chạy máy ảo, viết code.
• **Khối Thiết kế / Đồ họa / Kiến trúc**: Cần màn hình chuẩn màu 100% DCI-P3 và card đồ họa rời NVIDIA RTX để dựng 3D/video.

👉 **Dưới đây là 3 mẫu laptop đa năng và bền bỉ nhất được sinh viên ưa chuộng tại GearVN:**";

                    suggestedIds = new List<int> { 1, 4, 3 };
                }
                // 6. GAMING / CHƠI GAME / GAME THỦ / WUKONG / CS2 / VALORANT / PUBG / FO4
                else if (lower.Contains("game") || lower.Contains("gaming") || lower.Contains("chơi") ||
                         lower.Contains("wukong") || lower.Contains("cs2") || lower.Contains("valorant") ||
                         lower.Contains("pubg") || lower.Contains("fps") || lower.Contains("esports") || lower.Contains("rtx"))
                {
                    replyMessage = @"🔥 Chào bạn! Để có trải nghiệm **chiến game mượt mà ở mức FPS cao nhất và đồ họa Max Setting** (kể cả Black Myth Wukong, Cyberpunk 2077 hay các tựa game FPS thi đấu):

1. **GPU NVIDIA GeForce RTX 40 Series**: Tích hợp công nghệ DLSS 3.5 và Frame Generation giúp nhân đôi số khung hình.
2. **Tản nhiệt đỉnh cao**: Hệ thống quạt kép hoặc buồng hơi (Vapor Chamber) để máy luôn mát mẻ, duy trì xung nhịp cao trong suốt trận đấu.
3. **Màn hình tần số quét cao (165Hz - 240Hz)**: Triệt tiêu hiện tượng xé hình, bắt trọn từng chuyển động của đối thủ.

👉 **Các cỗ máy chiến game hàng đầu tại GearVN:**";

                    suggestedIds = new List<int> { 5, 2, 7 };
                }
                // 7. BÀN PHÍM CƠ / PHÍM CUSTOM / GÕ ÊM / SWITCH / KEYBOARD
                else if (lower.Contains("bàn phím") || lower.Contains("phím") || lower.Contains("switch") ||
                         lower.Contains("keychron") || lower.Contains("gõ êm") || lower.Contains("custom") ||
                         lower.Contains("rainy") || lower.Contains("lofree") || lower.Contains("nuphy"))
                {
                    replyMessage = @"⌨️ Chào bạn! Nếu bạn muốn tìm một chiếc **Bàn phím cơ cao cấp** để nâng cấp trải nghiệm gõ phím hằng ngày:

• **Âm thanh & Cảm giác gõ**: Đã được lót sẵn foam tiêu âm nhiều lớp, switch pre-lubed mượt mà cho âm gõ 'thock' êm ái, không gây ồn văn phòng.
• **Vỏ nhôm CNC & Mạch xuôi**: Cầm đầm tay, chắc chắn, hỗ trợ hot-swap để bạn tùy ý đổi switch theo sở thích.
• **Kết nối đa thiết bị**: 3 chế độ (Type-C, Bluetooth 5.1, Wireless 2.4GHz) tương thích hoàn hảo cả Windows và macOS.

👉 **Top 3 bàn phím cơ Custom được yêu thích nhất tại GearVN:**";

                    suggestedIds = new List<int> { 8, 9, 10 };
                }
                // 8. TAI NGHE / AUDIO / CHỐNG ỒN / HEADPHONE
                else if (lower.Contains("tai nghe") || lower.Contains("audio") || lower.Contains("chống ồn") ||
                         lower.Contains("headphone") || lower.Contains("sony") || lower.Contains("steelseries") || lower.Contains("âm thanh"))
                {
                    replyMessage = @"🎧 Chào bạn! Về thiết bị âm thanh, GearVN cung cấp các mẫu tai nghe đầu bảng phục vụ cả công việc lẫn thi đấu:

• **Chống ồn chủ động (ANC)**: Lọc sạch tạp âm môi trường, giúp bạn tập trung cao độ khi làm việc, nghe nhạc Hi-Res hay học tập.
• **Âm thanh vòm không gian**: Tái tạo chính xác hướng bước chân và tiếng súng trong game bắn súng sinh tồn.

👉 **Các mẫu tai nghe hàng đầu đang sẵn hàng:**";

                    suggestedIds = new List<int> { 15, 16 };
                }
                // 9. CHUỘT / MOUSE / CHUỘT GAMING / LOGITECH / RAZER
                else if (lower.Contains("chuột") || lower.Contains("mouse") || lower.Contains("superlight") ||
                         lower.Contains("viper") || lower.Contains("g pro"))
                {
                    replyMessage = @"🖱️ Chào bạn! GearVN xin giới thiệu những chú chuột gaming eSports có cảm biến đỉnh cao và trọng lượng siêu nhẹ:

• **Trọng lượng siêu nhẹ ~60g**: Vẩy tâm chuẩn xác, không mỏi cổ tay khi chơi game trong thời gian dài.
• **Cảm biến quang học chính xác từng pixel**: Tốc độ phản hồi cực cao lên tới 4000Hz - 8000Hz, không bao giờ lo bị trễ.

👉 **2 mẫu chuột Gaming hàng đầu thế giới tại GearVN:**";

                    suggestedIds = new List<int> { 17, 18 };
                }
                // 10. CHÍNH SÁCH / BẢO HÀNH / TRẢ GÓP / ĐỊA CHỈ SHOWROOM
                else if (lower.Contains("bảo hành") || lower.Contains("trả góp") || lower.Contains("địa chỉ") ||
                         lower.Contains("showroom") || lower.Contains("vận chuyển") || lower.Contains("freeship") || lower.Contains("đổi trả"))
                {
                    replyMessage = @"🏢 Chào bạn! GEARVN xin gửi đến bạn chính sách bán hàng & hỗ trợ chính hãng:

• **Bảo hành**: 100% sản phẩm bảo hành chính hãng từ 12 đến 24 tháng theo đúng tiêu chuẩn nhà sản xuất.
• **Đổi mới 30 ngày**: Nếu sản phẩm có lỗi phát sinh do nhà sản xuất, GearVN hỗ trợ 1 đổi 1 ngay lập tức.
• **Trả góp 0%**: Hỗ trợ qua thẻ tín dụng hoặc các công ty tài chính, thủ tục duyệt nhanh chỉ 15 phút.
• **Vận chuyển**: Freeship toàn quốc cho đơn từ 500.000đ; giao hỏa tốc 2 giờ tại nội thành TP.HCM & Hà Nội.
• **Hotline hỗ trợ miễn phí**: 1800.6975 (8:00 - 21:30 hàng ngày).

👉 Dưới đây là các sản phẩm đang được áp dụng chương trình khuyến mãi tốt nhất hôm nay:";

                    suggestedIds = new List<int> { 1, 2, 5 };
                }
                // 11. LỌC THEO MỨC GIÁ / TẦM TIỀN THÔNG MINH
                else if (lower.Contains("triệu") || lower.Contains("tr") || lower.Contains("giá rẻ") || lower.Contains("ngân sách") || lower.Contains("tầm giá"))
                {
                    decimal maxPrice = 999999999m;
                    if (lower.Contains("dưới 5") || lower.Contains("5tr") || lower.Contains("5 triệu")) maxPrice = 5000000m;
                    else if (lower.Contains("dưới 10") || lower.Contains("10tr") || lower.Contains("10 triệu")) maxPrice = 10000000m;
                    else if (lower.Contains("dưới 20") || lower.Contains("20tr") || lower.Contains("20 triệu")) maxPrice = 20000000m;
                    else if (lower.Contains("dưới 50") || lower.Contains("50tr") || lower.Contains("50 triệu")) maxPrice = 50000000m;
                    else if (lower.Contains("dưới 70") || lower.Contains("70tr") || lower.Contains("70 triệu")) maxPrice = 70000000m;

                    var priceMatched = allProducts.Where(p => p.Price <= maxPrice).OrderByDescending(p => p.Price).Take(3).ToList();
                    suggestedIds = priceMatched.Select(p => p.Id).ToList();

                    replyMessage = $"💰 Chào bạn! Dựa trên mức ngân sách dự kiến của bạn, GearVN đã tuyển chọn {priceMatched.Count} sản phẩm có tỷ lệ hiệu năng / giá thành (P/P) tốt nhất đang sẵn hàng:";
                }
                // 12. TÌM THEO TÊN HÃNG HOẶC MODEL CỤ THỂ
                else
                {
                    var brandMatch = allProducts.Where(p => lower.Contains(p.Name.ToLower())).Take(3).ToList();
                    if (brandMatch.Any())
                    {
                        suggestedIds = brandMatch.Select(p => p.Id).ToList();
                        replyMessage = $"👋 GearVN xin chào bạn! Dưới đây là các sản phẩm chính hãng đúng theo thương hiệu và dòng máy bạn đang quan tâm:";
                    }
                    else
                    {
                        // Câu trả lời tổng quan thông minh cho bất cứ câu hỏi nào khác
                        suggestedIds = new List<int> { 1, 2, 8 };
                        replyMessage = $"👋 Xin chào bạn! Tôi là **GearVN AI Assistant** - Trợ lý tư vấn công nghệ chuyên sâu của hệ thống GEARVN.\n\nTôi đã nhận được câu hỏi: *\"{request.Message}\"*.\n\nĐể tôi tư vấn chính xác nhất cấu hình tối ưu cho bạn, bạn có thể chia sẻ thêm:\n1. **Nhu cầu sử dụng chính**: Sinh viên ngành nào (Marketing, CNTT, Kinh tế, Thiết kế đồ họa) hay chuyên chơi game?\n2. **Mức ngân sách dự kiến**: Dưới 20 triệu, 30-50 triệu hay phân khúc Flagship cao cấp?\n3. **Ưu tiên đặc biệt**: Mỏng nhẹ pin trâu, màn hình chuẩn màu hay hiệu năng tản nhiệt khủng?\n\n👉 Dưới đây là 3 thiết bị cao cấp tiêu biểu đang được yêu thích nhất tại GearVN:";
                    }
                }
            }

            // Lấy danh sách sản phẩm theo thứ tự gợi ý
            var finalProducts = await _context.Products
                .Where(p => suggestedIds.Contains(p.Id))
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryName = p.Category != null ? p.Category.Name : ""
                })
                .ToListAsync();

            var orderedProducts = suggestedIds
                .Select(id => finalProducts.FirstOrDefault(fp => fp.Id == id))
                .Where(p => p != null)
                .ToList();

            return Ok(new
            {
                message = replyMessage,
                products = orderedProducts
            });
        }
    }

    public class ChatRequestDto
    {
        public string Message { get; set; } = string.Empty;
    }
}
