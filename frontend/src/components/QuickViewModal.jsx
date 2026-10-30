import { useState, useMemo } from 'react';
import {
  X, ShoppingCart, Check, ShieldCheck, Zap, Truck,
  ZoomIn, ArrowRight, Award, RotateCcw, Cpu, Monitor,
  HardDrive, Battery, Gauge, Wifi, Gift, Sparkles, Star
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const formatVND = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';

// Helper to extract key specs based on product category & description
function parseSpecs(product) {
  const desc = product.description || '';
  const name = product.name || '';
  const lowerName = name.toLowerCase();
  const lowerDesc = desc.toLowerCase();

  // 1. Mouse / Chuột
  if (product.categoryId === 5 || lowerName.includes('chuột')) {
    let weight = '60g - Siêu nhẹ';
    if (lowerDesc.includes('39 gram') || lowerDesc.includes('39g')) weight = '39g (Siêu nhẹ nhất thế giới)';
    else if (lowerDesc.includes('51g')) weight = '51g (Siêu nhẹ eSports)';
    else if (lowerDesc.includes('54g')) weight = '54g (Tối ưu FPS)';
    else if (lowerDesc.includes('57g')) weight = '57g (Chống đục lỗ)';
    else if (lowerDesc.includes('63g')) weight = '63g (Chuẩn thi đấu)';
    else if (lowerDesc.includes('68g')) weight = '68g (Tổ ong IP54)';
    else if (lowerDesc.includes('85g')) weight = '85g (Kèm dock sạc)';

    let sensor = 'Cảm biến quang học eSports';
    if (lowerDesc.includes('paw3395')) sensor = 'PixArt PAW3395 (26.000 DPI)';
    else if (lowerDesc.includes('hero 25k')) sensor = 'Logitech HERO 25K (25.600 DPI)';
    else if (lowerDesc.includes('focus pro 30k')) sensor = 'Razer Focus Pro 30K DPI';
    else if (lowerDesc.includes('aimpoint pro 42.000')) sensor = 'ROG AimPoint Pro 42.000 DPI';
    else if (lowerDesc.includes('8000 dpi')) sensor = 'Darkfield 8000 DPI (Di trên kính)';
    else if (lowerDesc.includes('truemove air')) sensor = 'SteelSeries TrueMove Air';

    let pollingRate = '1000Hz Polling Rate';
    if (lowerDesc.includes('8000hz')) pollingRate = '8000Hz Siêu tốc không dây';
    else if (lowerDesc.includes('4000hz')) pollingRate = '4000Hz (4K Polling Rate)';

    let battery = 'Pin sạc 70 - 150 giờ liên tục';
    if (lowerDesc.includes('200 giờ')) battery = 'Lên đến 200 giờ (Bluetooth/2.4G)';
    else if (lowerDesc.includes('dock sạc')) battery = 'Pin 930mAh + Dock sạc RGB hít nam châm';

    return [
      { label: 'Cảm biến', value: sensor, icon: Gauge },
      { label: 'Trọng lượng', value: weight, icon: Zap },
      { label: 'Tần số phản hồi', value: pollingRate, icon: Wifi },
      { label: 'Thời lượng Pin', value: battery, icon: Battery },
      { label: 'Kết nối', value: 'Không dây 2.4GHz / Bluetooth / Type-C', icon: Wifi },
      { label: 'Bảo hành', value: '24 Tháng chính hãng GearVN 1 đổi 1', icon: ShieldCheck },
    ];
  }

  // 2. Monitor / Màn hình
  if (product.categoryId === 4 || lowerName.includes('màn hình')) {
    let panel = 'Fast IPS / Chống lóa';
    if (lowerDesc.includes('oled')) panel = 'OLED Gaming (0.03ms GtG)';
    else if (lowerDesc.includes('ips black')) panel = 'IPS Black 2000:1 tương phản sâu';
    else if (lowerDesc.includes('quantum dot')) panel = 'Quantum Dot Rapid IPS';
    else if (lowerDesc.includes('va')) panel = 'Curved VA 1000R';

    let refresh = '180Hz';
    if (lowerDesc.includes('240hz')) refresh = '240Hz Siêu tốc độ';
    else if (lowerDesc.includes('180hz')) refresh = '180Hz 1ms (GtG)';
    else if (lowerDesc.includes('170hz')) refresh = '170Hz 0.5ms';
    else if (lowerDesc.includes('165hz')) refresh = '165Hz 1ms';
    else if (lowerDesc.includes('120hz')) refresh = '120Hz mượt mà';

    let resolution = 'FHD (1920x1080)';
    if (lowerDesc.includes('6k') || lowerDesc.includes('6144')) resolution = '6K (6144 x 3456) Studio';
    else if (lowerDesc.includes('5120x1440')) resolution = 'Dual QHD 49" (5120x1440)';
    else if (lowerDesc.includes('2k') || lowerDesc.includes('2560x1440')) resolution = '2K QHD (2560x1440)';

    return [
      { label: 'Độ phân giải', value: resolution, icon: Monitor },
      { label: 'Tấm nền', value: panel, icon: Zap },
      { label: 'Tần số quét', value: refresh, icon: Gauge },
      { label: 'Chuẩn màu', value: '100% sRGB / 98% DCI-P3 Điện ảnh', icon: Star },
      { label: 'Công nghệ', value: 'G-Sync Compatible, FreeSync Premium', icon: ShieldCheck },
      { label: 'Bảo hành', value: '36 Tháng chính hãng tận nhà', icon: Award },
    ];
  }

  // 3. Laptop / Máy tính
  if (product.categoryId === 1 || lowerName.includes('laptop') || lowerName.includes('macbook')) {
    let cpu = 'Intel Core / AMD Ryzen / Apple Silicon';
    if (lowerDesc.includes('m3 max')) cpu = 'Apple M3 Max (16-core CPU)';
    else if (lowerDesc.includes('m3 pro')) cpu = 'Apple M3 Pro (11-core CPU)';
    else if (lowerDesc.includes('m3')) cpu = 'Apple M3 Thế hệ mới';
    else if (lowerDesc.includes('i9-14900hx')) cpu = 'Intel Core i9-14900HX 24 cores';
    else if (lowerDesc.includes('ultra 9')) cpu = 'Intel Core Ultra 9 185H AI';
    else if (lowerDesc.includes('ultra 7')) cpu = 'Intel Core Ultra 7 155H NPU';
    else if (lowerDesc.includes('ryzen 9')) cpu = 'AMD Ryzen 9 8945HS AI NPU';
    else if (lowerDesc.includes('ryzen 7')) cpu = 'AMD Ryzen 7 7735HS 8-core';

    let ram = '16GB DDR5 High-speed';
    if (lowerDesc.includes('48gb')) ram = '48GB Unified Memory';
    else if (lowerDesc.includes('32gb')) ram = '32GB DDR5 5600MHz';
    else if (lowerDesc.includes('18gb')) ram = '18GB Unified Memory';
    else if (lowerDesc.includes('8gb')) ram = '8GB DDR5';

    let vga = 'Card đồ họa rời thế hệ mới';
    if (lowerDesc.includes('rtx 4090')) vga = 'NVIDIA GeForce RTX 4090 16GB';
    else if (lowerDesc.includes('rtx 4080')) vga = 'NVIDIA GeForce RTX 4080 12GB';
    else if (lowerDesc.includes('rtx 4070')) vga = 'NVIDIA GeForce RTX 4070 8GB';
    else if (lowerDesc.includes('rtx 4060')) vga = 'NVIDIA GeForce RTX 4060 8GB';
    else if (lowerDesc.includes('rtx 4050')) vga = 'NVIDIA GeForce RTX 4050 6GB';
    else if (lowerDesc.includes('gpu 40-core')) vga = 'Apple 40-core GPU Siêu mạnh';
    else if (lowerDesc.includes('gpu 14-core')) vga = 'Apple 14-core GPU';
    else if (lowerDesc.includes('intel arc')) vga = 'Intel Arc Graphics AI';

    return [
      { label: 'Vi xử lý (CPU)', value: cpu, icon: Cpu },
      { label: 'Bộ nhớ RAM', value: ram, icon: HardDrive },
      { label: 'Card đồ họa (VGA)', value: vga, icon: Zap },
      { label: 'Màn hình', value: 'Màn hình chuẩn màu, tần số cao 120Hz-240Hz', icon: Monitor },
      { label: 'Trọng lượng / Pin', value: 'Pin trâu từ 8h - 18h, tản nhiệt buồng hơi', icon: Battery },
      { label: 'Bảo hành', value: '24 Tháng chính hãng toàn quốc', icon: ShieldCheck },
    ];
  }

  // 4. Default / Keyboards & Audio
  return [
    { label: 'Phân loại', value: product.categoryName || 'Sản phẩm GearVN', icon: Award },
    { label: 'Tình trạng', value: product.stockQuantity > 0 ? `Còn hàng (${product.stockQuantity} chiếc)` : 'Tạm hết', icon: Zap },
    { label: 'Kết nối', value: 'Đa phương thức (Type-C / 2.4G / Bluetooth)', icon: Wifi },
    { label: 'Chất liệu / Hoàn thiện', value: 'Gia công tinh xảo, linh kiện chọn lọc cao cấp', icon: Star },
    { label: 'Bảo hành', value: '24 Tháng chính hãng GearVN 1 đổi 1', icon: ShieldCheck },
  ];
}

export default function QuickViewModal({ product, isOpen, onClose, onOpenAuth, onOpenCart, onToast }) {
  const { addItem } = useCart();
  const { isLoggedIn } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' or 'desc'

  const specs = useMemo(() => {
    if (!product) return [];
    return parseSpecs(product);
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      onOpenAuth?.();
      return;
    }
    addItem(product, quantity);
    setAdded(true);
    onToast?.('success', `Đã thêm ${quantity}x "${product.name}" vào giỏ hàng!`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      onClose();
      onOpenAuth?.();
      return;
    }
    addItem(product, quantity);
    onToast?.('success', `Đã thêm "${product.name}" vào giỏ hàng!`);
    onClose();
    onOpenCart?.();
  };

  const isOutOfStock = product.stockQuantity === 0;
  const originalPrice = Math.round(product.price * 1.15);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="absolute inset-0"
        onClick={() => {
          setIsZoomed(false);
          onClose();
        }}
      />

      <div className="relative w-full max-w-5xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[92vh]">
        
        {/* Top gearvn red accent line */}
        <div className="absolute inset-x-0 top-0 h-1.5 bg-[#e30019] z-20" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors shadow-sm cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Large Image & Badges */}
        <div className="md:w-5/12 bg-[#f8fafc] p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-200">
          <div>
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-gray-200 flex items-center justify-center shadow-sm group">
              <img
                src={product.imageUrl}
                alt={product.name}
                className={`w-full h-full object-contain p-4 transition-transform duration-500 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'group-hover:scale-105 cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed(z => !z)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = FALLBACK_IMAGE;
                }}
              />

              {/* Discount badge */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
                <span className="px-2.5 py-1 bg-[#e30019] text-white text-[10px] font-black rounded-lg shadow-sm">
                  -{discountPercent}%
                </span>
                <span className="px-2 py-0.5 bg-black/75 text-white text-[9px] font-bold rounded">
                  Chính hãng
                </span>
              </div>

              {/* Zoom Button */}
              <button
                type="button"
                onClick={() => setIsZoomed(z => !z)}
                className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-white/90 hover:bg-white text-gray-700 shadow-sm transition-all flex items-center gap-1 text-[11px] font-bold border border-gray-200 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5 text-[#e30019]" />
                <span>{isZoomed ? 'Thu nhỏ' : 'Phóng to'}</span>
              </button>
            </div>

            {/* Commitments list */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              <div className="p-2 bg-white rounded-xl border border-gray-200">
                <Award className="w-4 h-4 text-[#e30019] mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-800 block">100% Chính Hãng</span>
                <span className="text-[9px] text-gray-500">Đầy đủ VAT</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-gray-200">
                <ShieldCheck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-800 block">Bảo Hành 24T</span>
                <span className="text-[9px] text-gray-500">Chính hãng GVN</span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-gray-200">
                <RotateCcw className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-gray-800 block">1 Đổi 1 - 30 Ngày</span>
                <span className="text-[9px] text-gray-500">Lỗi là đổi mới</span>
              </div>
            </div>
          </div>

          {/* Exclusive Promo Box */}
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs font-black text-[#e30019] mb-1">
              <Gift className="w-4 h-4" />
              <span>QUÀ TẶNG KÈM ĐỘC QUYỀN GEARVN</span>
            </div>
            <ul className="text-[11px] text-gray-700 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e30019]" />
                <span>Tặng Balo Gaming + Chuột GVN trị giá 450.000đ</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e30019]" />
                <span>Tặng Bàn di chuột Speed XL trị giá 150.000đ</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e30019]" />
                <span>Hỗ trợ cài đặt phần mềm & vệ sinh máy trọn đời</span>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Info, Structured Specs, CTAs */}
        <div className="md:w-7/12 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto bg-white">
          <div>
            {/* Stock Badge & Brand */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e30019] bg-red-50 px-2.5 py-0.5 rounded-md">
                {product.categoryName || 'Sản phẩm GearVN'}
              </span>

              {isOutOfStock ? (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-red-100 text-red-700">
                  Tạm hết hàng
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Còn hàng ({product.stockQuantity} sản phẩm sẵn có)
                </span>
              )}
            </div>

            {/* Product Title */}
            <h2 className="text-lg sm:text-xl font-black text-gray-900 leading-snug mb-2">
              {product.name}
            </h2>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mb-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
              <span className="text-2xl sm:text-3xl font-black text-[#e30019]">
                {formatVND(product.price)}
              </span>
              <span className="text-sm text-gray-400 line-through font-medium">
                {formatVND(originalPrice)}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold ml-auto bg-emerald-50 px-2 py-0.5 rounded">
                Tiết kiệm {formatVND(originalPrice - product.price)}
              </span>
            </div>

            {/* Tabs: Specs vs Overview */}
            <div className="flex items-center gap-2 border-b border-gray-200 mb-3">
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className={`pb-2 px-3 text-xs font-black transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'specs'
                    ? 'border-[#e30019] text-[#e30019]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>BẢNG THÔNG SỐ KỸ THUẬT</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('desc')}
                className={`pb-2 px-3 text-xs font-black transition-all cursor-pointer border-b-2 flex items-center gap-1.5 ${
                  activeTab === 'desc'
                    ? 'border-[#e30019] text-[#e30019]'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>MÔ TẢ CHI TIẾT</span>
              </button>
            </div>

            {/* Tab 1: Detailed Structured Specs Grid */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 animate-in fade-in duration-200">
                {specs.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-2.5 hover:bg-red-50/40 hover:border-red-100 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-white text-[#e30019] shadow-2xs flex-shrink-0 mt-0.5">
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wide">
                          {item.label}
                        </span>
                        <span className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Full Paragraph Description */}
            {activeTab === 'desc' && (
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 mb-4 animate-in fade-in duration-200">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Shipping Policy */}
            <div className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl mb-4 font-medium">
              <Truck className="w-4 h-4 text-[#e30019] flex-shrink-0" />
              <span>Giao siêu tốc 2 giờ nội thành TP.HCM & Hà Nội • Freeship toàn quốc</span>
            </div>
          </div>

          {/* ACTION BUTTONS & QUANTITY */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700">Số lượng:</span>
              <div className="flex items-center bg-gray-100 border border-gray-300 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-gray-900 min-w-[2.2rem] text-center bg-white">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                  disabled={quantity >= product.stockQuantity || isOutOfStock}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : added
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white hover:bg-red-50 text-[#e30019] border-2 border-[#e30019] active:scale-98'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" /> Đã thêm giỏ!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" /> Thêm vào giỏ
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                style={{ backgroundColor: '#e30019' }}
                className="py-3 text-white text-xs sm:text-sm font-black rounded-xl shadow-lg hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Mua ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
