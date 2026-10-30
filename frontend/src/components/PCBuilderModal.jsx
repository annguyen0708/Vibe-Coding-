import { useState, useMemo } from 'react';
import {
  X, Cpu, HardDrive, Zap, Trash2, ShoppingCart, Check,
  Share2, RotateCcw, ShieldCheck, Sparkles, AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const formatVND = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const PC_COMPONENTS = [
  {
    category: 'CPU - Bộ vi xử lý',
    key: 'cpu',
    options: [
      { id: 'cpu-1', name: 'Intel Core i9-14900K (3.2GHz Turbo 6.0GHz, 24 Nhân 32 Luồng)', price: 15490000, watt: 253 },
      { id: 'cpu-2', name: 'Intel Core i7-14700K (3.4GHz Turbo 5.6GHz, 20 Nhân 28 Luồng)', price: 11290000, watt: 253 },
      { id: 'cpu-3', name: 'AMD Ryzen 7 7800X3D (4.2GHz Turbo 5.0GHz, Chiến Game Số 1)', price: 10990000, watt: 120 },
      { id: 'cpu-4', name: 'Intel Core i5-14600K (3.5GHz Turbo 5.3GHz, 14 Nhân 20 Luồng)', price: 8290000, watt: 181 },
    ]
  },
  {
    category: 'Mainboard - Bo mạch chủ',
    key: 'mainboard',
    options: [
      { id: 'mb-1', name: 'ASUS ROG MAXIMUS Z790 DARK HERO (Wi-Fi 7, DDR5)', price: 17990000, watt: 50 },
      { id: 'mb-2', name: 'MSI MAG Z790 TOMAHAWK WIFI DDR5', price: 7490000, watt: 40 },
      { id: 'mb-3', name: 'ASUS TUF GAMING B760-PLUS WIFI DDR5', price: 4890000, watt: 30 },
      { id: 'mb-4', name: 'GIGABYTE B650 AORUS ELITE AX (Dành cho AMD AM5)', price: 5690000, watt: 35 },
    ]
  },
  {
    category: 'RAM - Bộ nhớ trong',
    key: 'ram',
    options: [
      { id: 'ram-1', name: 'Corsair Dominator Titanium RGB 64GB (2x32GB) DDR5 6000MHz', price: 7990000, watt: 15 },
      { id: 'ram-2', name: 'Kingston Fury Beast RGB 32GB (2x16GB) DDR5 5600MHz', price: 3490000, watt: 10 },
      { id: 'ram-3', name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6400MHz Black', price: 4290000, watt: 12 },
    ]
  },
  {
    category: 'VGA - Card màn hình',
    key: 'vga',
    options: [
      { id: 'vga-1', name: 'ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X', price: 58990000, watt: 450 },
      { id: 'vga-2', name: 'MSI GeForce RTX 4080 SUPER 16G GAMING X SLIM', price: 31990000, watt: 320 },
      { id: 'vga-3', name: 'GIGABYTE GeForce RTX 4070 Ti SUPER EAGLE OC 16GB', price: 23990000, watt: 285 },
      { id: 'vga-4', name: 'ASUS Dual GeForce RTX 4060 Ti OC Edition 8GB GDDR6', price: 11490000, watt: 160 },
    ]
  },
  {
    category: 'SSD - Ổ cứng lưu trữ',
    key: 'ssd',
    options: [
      { id: 'ssd-1', name: 'Samsung 990 PRO 2TB PCIe 4.0 NVMe M.2 (Đọc 7450MB/s)', price: 4890000, watt: 10 },
      { id: 'ssd-2', name: 'Kingston KC3000 1TB PCIe 4.0 NVMe M.2 (Đọc 7000MB/s)', price: 2590000, watt: 8 },
      { id: 'ssd-3', name: 'Western Digital Black SN850X 2TB PCIe Gen4', price: 4690000, watt: 9 },
    ]
  },
  {
    category: 'PSU - Nguồn máy tính',
    key: 'psu',
    options: [
      { id: 'psu-1', name: 'Corsair RM1000e 1000W 80 Plus Gold (PCIe 5.0 ATX 3.0)', price: 4590000, watt: 0 },
      { id: 'psu-2', name: 'ASUS TUF Gaming 850W 80 Plus Gold (ATX 3.0)', price: 3490000, watt: 0 },
      { id: 'psu-3', name: 'Deepcool PK650D 650W 80 Plus Bronze', price: 1390000, watt: 0 },
    ]
  },
  {
    category: 'Case - Vỏ máy tính',
    key: 'case',
    options: [
      { id: 'case-1', name: 'Lian Li O11 Dynamic EVO RGB Black (Kính cường lực 2 mặt)', price: 4390000, watt: 0 },
      { id: 'case-2', name: 'NZXT H6 Flow RGB Black (Tối ưu luồng gió kép)', price: 3590000, watt: 0 },
      { id: 'case-3', name: 'Xigmatek Aqua Ultra M (Kèm 3 Fan RGB sẵn)', price: 1590000, watt: 0 },
    ]
  },
  {
    category: 'Tản nhiệt CPU',
    key: 'cooler',
    options: [
      { id: 'cooler-1', name: 'Tản nhiệt nước ASUS ROG RYUJIN III 360 ARGB (Màn hình LCD 3.5")', price: 9290000, watt: 25 },
      { id: 'cooler-2', name: 'Tản nhiệt nước Thermalright Frozen Warframe 360 Black ARGB', price: 2590000, watt: 15 },
      { id: 'cooler-3', name: 'Tản nhiệt khí Deepcool AK620 Digital Black (Màn hình nhiệt độ)', price: 1790000, watt: 10 },
    ]
  }
];

const PCBuilderModal = ({ isOpen, onClose, onToast }) => {
  const { addItem } = useCart();
  const [selectedParts, setSelectedParts] = useState({});

  const handleSelectPart = (catKey, option) => {
    setSelectedParts(prev => ({
      ...prev,
      [catKey]: option
    }));
  };

  const handleRemovePart = (catKey) => {
    setSelectedParts(prev => {
      const copy = { ...prev };
      delete copy[catKey];
      return copy;
    });
  };

  const clearAllParts = () => {
    setSelectedParts({});
  };

  // Calculate totals
  const { totalPrice, totalWatt, count } = useMemo(() => {
    let price = 0;
    let watt = 100; // Base system overhead
    let c = 0;
    Object.values(selectedParts).forEach(part => {
      if (part) {
        price += part.price;
        watt += (part.watt || 0);
        c += 1;
      }
    });
    return { totalPrice: price, totalWatt: watt, count: c };
  }, [selectedParts]);

  const handleAddBuildToCart = () => {
    if (count === 0) return;
    
    // Create a composite product item for cart
    const customBuildProduct = {
      id: 9999 + Math.floor(Math.random() * 1000),
      name: `Bộ PC Custom GVN (${count} linh kiện)`,
      price: totalPrice,
      imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
      stockQuantity: 10,
      description: Object.entries(selectedParts).map(([k, v]) => `• ${v.name}`).join('\n')
    };

    addItem(customBuildProduct, 1);
    onToast?.(`🎉 Đã thêm trọn bộ PC Custom (${formatVND(totalPrice)}) vào giỏ hàng!`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Top bar */}
        <div style={{ backgroundColor: '#e30019' }} className="h-1.5 w-full flex-shrink-0" />

        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#e30019]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  XÂY DỰNG CẤU HÌNH PC GAMING
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#e30019] text-white">
                  GEARVN GVN PC
                </span>
              </div>
              <p className="text-xs text-gray-500">Tự do tùy biến linh kiện chính hãng • Bảo hành tận nơi • Hỗ trợ lắp ráp miễn phí</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {count > 0 && (
              <button
                type="button"
                onClick={clearAllParts}
                className="text-xs text-gray-400 hover:text-[#e30019] font-semibold px-2 py-1"
              >
                Làm mới cấu hình
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Builder Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/70">
          {PC_COMPONENTS.map((comp) => {
            const currentSelected = selectedParts[comp.key];

            return (
              <div
                key={comp.key}
                className={`p-4 rounded-2xl border transition-all ${
                  currentSelected
                    ? 'bg-white border-[#e30019]/40 shadow-sm'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e30019]"></span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider">
                      {comp.category}
                    </h3>
                  </div>

                  {currentSelected && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-[#e30019] font-black">
                        {formatVND(currentSelected.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemovePart(comp.key)}
                        className="p-1 text-gray-400 hover:text-[#e30019] rounded transition-colors"
                        title="Bỏ chọn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Option radio buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {comp.options.map(option => {
                    const isPicked = currentSelected?.id === option.id;

                    return (
                      <div
                        key={option.id}
                        onClick={() => handleSelectPart(comp.key, option)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isPicked
                            ? 'bg-red-50/60 border-[#e30019] text-gray-900 shadow-sm'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                            isPicked ? 'border-[#e30019] bg-[#e30019] text-white' : 'border-gray-300 bg-white'
                          }`}>
                            {isPicked && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className={`truncate ${isPicked ? 'font-bold' : ''}`}>
                            {option.name}
                          </span>
                        </div>
                        <span className="font-extrabold text-[#e30019] flex-shrink-0">
                          {formatVND(option.price)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Builder Footer & Price Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-gray-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-6 text-xs w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <p className="text-gray-400 font-medium">Linh kiện đã chọn:</p>
              <p className="text-gray-900 font-bold text-sm">
                <span className="text-[#e30019] font-black">{count}</span> / {PC_COMPONENTS.length} linh kiện
              </p>
            </div>

            <div className="border-l border-gray-200 pl-4">
              <p className="text-gray-400 font-medium">Công suất khuyến nghị:</p>
              <p className="text-gray-900 font-bold text-sm flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                <span>{totalWatt}W (Nguồn ~{Math.ceil((totalWatt * 1.3) / 50) * 50}W)</span>
              </p>
            </div>

            <div className="border-l border-gray-200 pl-4">
              <p className="text-gray-400 font-medium">Tổng tiền cấu hình:</p>
              <p className="text-[#e30019] font-black text-lg sm:text-xl leading-none">
                {formatVND(totalPrice)}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              disabled={count === 0}
              onClick={handleAddBuildToCart}
              style={{ backgroundColor: '#e30019' }}
              className="flex-1 sm:flex-none px-6 py-3 hover:brightness-110 text-white text-xs sm:text-sm font-black rounded-xl shadow-lg shadow-red-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Thêm trọn bộ vào giỏ ({count})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PCBuilderModal;
