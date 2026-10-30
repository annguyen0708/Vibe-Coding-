import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Sparkles, SlidersHorizontal, ArrowUpDown,
  Search, ShieldCheck, Zap, Truck, Headphones, RotateCcw,
  Laptop, Keyboard, Check, Tag, Flame, ChevronRight, Clock, Star, Gift,
  Monitor, Mouse, ArrowRightLeft, Trophy, Percent
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import LuckyWheelModal from '../components/LuckyWheelModal';
import CompareModal from '../components/CompareModal';
import api from '../services/api';

const MARQUEE_PARTNERS = [
  'ASUS ROG', 'MSI', 'GIGABYTE', 'INTEL', 'AMD', 'NVIDIA', 'RAZER', 'LOGITECH G', 'CORSAIR', 'DELL', 'APPLE', 'KEYCHRON', 'SONY'
];

const BRANDS = [
  'Tất cả', 'Apple', 'ASUS', 'Lenovo', 'Dell', 'HP', 'MSI', 'Acer', 'Logitech', 'Razer', 'Keychron', 'Sony', 'Samsung', 'LG'
];

const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả mức giá', min: 0, max: Infinity },
  { id: 'under5m', label: '< 5 triệu', min: 0, max: 5000000 },
  { id: '5m_to_20m', label: '5 - 20 triệu', min: 5000000, max: 20000000 },
  { id: '20m_to_50m', label: '20 - 50 triệu', min: 20000000, max: 50000000 },
  { id: 'above50m', label: '> 50 triệu', min: 50000000, max: Infinity },
];

const SORT_OPTIONS = [
  { id: 'default', label: 'Nổi bật nhất' },
  { id: 'price_asc', label: 'Giá tăng dần' },
  { id: 'price_desc', label: 'Giá giảm dần' },
  { id: 'name_asc', label: 'Tên A - Z' },
];

const CATEGORY_TABS = [
  { id: null, label: 'Tất cả sản phẩm', icon: Sparkles },
  { id: 1, label: 'Laptop & Workstation', icon: Laptop },
  { id: 4, label: 'Màn hình Gaming & Đồ họa', icon: Monitor },
  { id: 5, label: 'Chuột & Bàn di Gaming', icon: Mouse },
  { id: 2, label: 'Bàn phím cơ Custom', icon: Keyboard },
  { id: 3, label: 'Gaming Gear & Audio', icon: Headphones },
];

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden animate-pulse border border-gray-200 p-3">
    <div className="aspect-[4/3] bg-gray-200 rounded-xl mb-3" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-6 bg-gray-200 rounded w-1/2 mt-3" />
      <div className="h-9 bg-gray-200 rounded-lg w-full mt-2" />
    </div>
  </div>
);

const HomePage = ({
  searchQuery,
  categoryId,
  onOpenAuth,
  onOpenCart,
  onAddToCart,
  onToast
}) => {
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(categoryId || null);
  const [selectedBrand, setSelectedBrand] = useState('Tất cả');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Compare & Lucky Wheel features
  const [compareItems, setCompareItems] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isLuckyWheelOpen, setIsLuckyWheelOpen] = useState(false);

  const handleToggleCompare = (product) => {
    setCompareItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        onToast?.('info', `Đã bỏ ${product.name} khỏi so sánh`);
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        onToast?.('warning', 'Chỉ có thể so sánh tối đa 4 sản phẩm cùng lúc!');
        return prev;
      }
      onToast?.('success', `Đã thêm ${product.name} vào so sánh`);
      return [...prev, product];
    });
  };

  // Sync prop changes from Navbar
  useEffect(() => {
    setSelectedCategory(categoryId);
  }, [categoryId]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch {
      // Fallback if API fails
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== null) {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // Brand
    if (selectedBrand !== 'Tất cả') {
      result = result.filter(p =>
        p.name.toLowerCase().includes(selectedBrand.toLowerCase())
      );
    }

    // Price
    const range = PRICE_RANGES.find(r => r.id === selectedPriceRange);
    if (range && range.id !== 'all') {
      result = result.filter(p => p.price >= range.min && p.price <= range.max);
    }

    // Sort
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name_asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrand, selectedPriceRange, sortBy]);

  // Featured Flash Sale items (Top 4 products)
  const flashSaleItems = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const hasActiveFilters = selectedCategory !== null || selectedBrand !== 'Tất cả' || selectedPriceRange !== 'all' || (searchQuery && searchQuery.trim());

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand('Tất cả');
    setSelectedPriceRange('all');
    setSortBy('default');
  };

  return (
    <main className="min-h-screen bg-[#f4f6f8] text-gray-800 overflow-x-hidden pt-[105px] md:pt-[137px] pb-16">
      
      {/* ─── HERO BANNER SECTION (GearVN Style with Real Images) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
          {/* Main Visual Banner */}
          <div
            onClick={() => {
              const el = document.getElementById('product-catalog');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="lg:col-span-2 relative rounded-2xl overflow-hidden h-60 sm:h-72 lg:h-[340px] group cursor-pointer shadow-lg border border-gray-800"
          >
            {/* Background image */}
            <img
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
              alt="GearVN Gaming Festival"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            {/* Gradient Overlay for high readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />

            {/* Banner Text Content */}
            <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e30019] text-white text-[11px] font-black rounded-md w-fit mb-2.5 shadow-md">
                <Flame className="w-3.5 h-3.5 text-yellow-300" /> SIÊU ĐẠI TIỆC GAMING GEARVN
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-2 tracking-tight">
                Laptop Gaming & <br />
                <span className="text-yellow-400">PC Đồ Họa Đỉnh Cao</span>
              </h1>
              <p className="text-gray-200 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2">
                Trang bị cấu hình Intel Core Ultra 9, RTX 4090 cực khủng. Trả góp 0%, quà tặng đến 5.000.000đ & Freeship toàn quốc!
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  style={{ backgroundColor: '#e30019' }}
                  className="px-5 py-2.5 hover:brightness-110 text-white text-xs sm:text-sm font-extrabold rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>Khám phá ngay</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-yellow-300 font-bold hidden sm:inline">
                  ⚡ Số lượng có hạn
                </span>
              </div>
            </div>
          </div>

          {/* 2 Side Visual Banners */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3.5">
            {/* Side 1: Laptop Gaming */}
            <div
              onClick={() => {
                setSelectedCategory(1);
                const el = document.getElementById('product-catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative rounded-2xl overflow-hidden h-36 lg:h-[162px] group cursor-pointer shadow-md border border-gray-800"
            >
              <img
                src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80"
                alt="Laptop Gaming"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4">
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-yellow-400 text-black text-[10px] font-black rounded shadow">
                  -30%
                </span>
                <p className="text-white text-xs sm:text-sm font-black mb-0.5 group-hover:text-yellow-400 transition-colors">
                  Laptop Gaming RTX 40
                </p>
                <p className="text-gray-300 text-[11px]">Chỉ từ 15.990.000₫</p>
              </div>
            </div>

            {/* Side 2: Bàn phím cơ Custom */}
            <div
              onClick={() => {
                setSelectedCategory(2);
                const el = document.getElementById('product-catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="relative rounded-2xl overflow-hidden h-36 lg:h-[162px] group cursor-pointer shadow-md border border-gray-800"
            >
              <img
                src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"
                alt="Bàn phím cơ Custom"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4">
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#e30019] text-white text-[10px] font-black rounded shadow">
                  HOT
                </span>
                <p className="text-white text-xs sm:text-sm font-black mb-0.5 group-hover:text-yellow-400 transition-colors">
                  Bàn Phím Cơ Custom
                </p>
                <p className="text-gray-300 text-[11px]">Âm thock cực êm • Gõ sướng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BADGES STRIP ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="flex items-center gap-3 justify-center py-1">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#e30019]" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-gray-900">100% Chính Hãng</p>
              <p className="text-[11px] text-gray-500">Bảo hành toàn quốc 24T</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center py-1">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-gray-900">Freeship Toàn Quốc</p>
              <p className="text-[11px] text-gray-500">Đơn hàng từ 500.000₫</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center py-1">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-gray-900">Đổi Mới 30 Ngày</p>
              <p className="text-[11px] text-gray-500">Nếu phát sinh lỗi NSX</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center py-1">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm font-bold text-gray-900">Giao Siêu Tốc 2H</p>
              <p className="text-[11px] text-gray-500">Nội thành TP.HCM & Hà Nội</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BRAND LOGO MARQUEE ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white rounded-2xl border border-gray-200 py-3 px-4 overflow-hidden flex items-center shadow-sm">
          <div className="flex items-center gap-2 pr-4 border-r border-gray-200 flex-shrink-0">
            <Star className="w-4 h-4 text-[#e30019]" />
            <span className="text-xs font-black uppercase text-gray-900 tracking-wider">Thương hiệu</span>
          </div>
          <div className="flex items-center gap-8 animate-marquee whitespace-nowrap pl-6">
            {[...MARQUEE_PARTNERS, ...MARQUEE_PARTNERS].map((brand, i) => (
              <span
                key={i}
                onClick={() => {
                  setSelectedBrand(brand);
                  const el = document.getElementById('product-catalog');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-black tracking-widest text-gray-500 hover:text-[#e30019] cursor-pointer transition-colors"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FLASH SALE SECTION (GearVN signature) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-gradient-to-r from-[#e30019] via-[#d70018] to-[#b80016] rounded-2xl p-4 sm:p-5 shadow-xl text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#e30019] flex items-center justify-center font-black">
                <Flame className="w-5 h-5 text-[#e30019]" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-2">
                  <span>⚡ Flash Sale Giờ Vàng</span>
                  <span className="text-xs px-2 py-0.5 bg-yellow-400 text-black font-extrabold rounded">GIÁ SỐC</span>
                </h2>
                <p className="text-xs text-white/80">Cơ hội săn Gaming Gear chính hãng giá tốt nhất trong ngày</p>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-1.5 text-xs font-bold bg-black/30 px-3.5 py-1.5 rounded-xl border border-white/20 w-fit">
              <Clock className="w-4 h-4 text-yellow-300" />
              <span>Kết thúc sau:</span>
              <span className="bg-white text-black px-1.5 py-0.5 rounded font-black">02</span>:
              <span className="bg-white text-black px-1.5 py-0.5 rounded font-black">45</span>:
              <span className="bg-white text-black px-1.5 py-0.5 rounded font-black">18</span>
            </div>
          </div>

          {/* Flash sale cards grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {flashSaleItems.map((prod) => (
              <div
                key={prod.id}
                onClick={() => setQuickViewProduct(prod)}
                className="bg-white rounded-xl p-3 text-gray-900 cursor-pointer hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-50 mb-2 p-2 flex items-center justify-center">
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#e30019] text-white text-[10px] font-black rounded">
                    -20%
                  </span>
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-xs font-bold line-clamp-2 text-gray-800 group-hover:text-[#e30019] transition-colors mb-1">
                  {prod.name}
                </h4>
                <div className="mt-auto">
                  <p className="text-sm font-extrabold text-[#e30019]">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(prod.price)}
                  </p>
                  <p className="text-[11px] text-gray-400 line-through">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Math.round(prod.price * 1.2))}
                  </p>
                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#e30019] h-full rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-[10px] text-gray-500 text-center mt-1 font-semibold">
                    Đã bán 18/25 sản phẩm
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MAIN PRODUCT CATALOG & FILTER BAR ─── */}
      <section id="product-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unified Clean Filter Panel */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm mb-6 space-y-4">
          
          {/* Header of catalog */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                <span>DANH SÁCH SẢN PHẨM GEARVN</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-50 text-[#e30019] font-bold">
                  {filteredProducts.length} sản phẩm
                </span>
              </h2>
              <p className="text-xs text-gray-500">Thiết bị gaming, laptop workstation & linh kiện công nghệ chính hãng</p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" /> Sắp xếp:
              </span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#e30019]"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {CATEGORY_TABS.map(tab => {
              const Icon = tab.icon;
              const isSelected = selectedCategory === tab.id;
              return (
                <button
                  key={String(tab.id)}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#e30019] text-white shadow-md'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Row: Brands & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
            {/* Brand Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-gray-600 mr-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-gray-400" /> Hãng:
              </span>
              {BRANDS.map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBrand(b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedBrand === b
                      ? 'bg-gray-900 text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>

            {/* Price Chips */}
            <div className="flex items-center gap-1.5 flex-wrap md:justify-end">
              <span className="font-bold text-gray-600 mr-1">Mức giá:</span>
              {PRICE_RANGES.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPriceRange(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedPriceRange === p.id
                      ? 'bg-[#e30019] text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filter Clear Bar */}
          {hasActiveFilters && (
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Đang lọc: {selectedBrand !== 'Tất cả' && `[Hãng: ${selectedBrand}] `}
                {selectedCategory !== null && `[Danh mục: ${CATEGORY_TABS.find(c => c.id === selectedCategory)?.label}] `}
                {selectedPriceRange !== 'all' && `[Giá: ${PRICE_RANGES.find(p => p.id === selectedPriceRange)?.label}]`}
              </span>
              <button
                type="button"
                onClick={resetFilters}
                className="text-[#e30019] font-bold hover:underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* ─── PRODUCT GRID ─── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center my-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#e30019] flex items-center justify-center mx-auto mb-3">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Không tìm thấy sản phẩm phù hợp</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              Thử tìm với từ khóa khác hoặc xóa bớt các tiêu chí lọc để xem thêm sản phẩm có sẵn tại kho.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              style={{ backgroundColor: '#e30019' }}
              className="px-5 py-2.5 text-white text-xs font-bold rounded-lg shadow-md hover:brightness-110"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onOpenAuth={onOpenAuth}
                onQuickView={p => setQuickViewProduct(p)}
                onToggleCompare={handleToggleCompare}
                isCompared={compareItems.some(p => p.id === product.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Floating Compare Bar */}
      {compareItems.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#1e1e1e] text-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-700 flex items-center gap-3 animate-in slide-in-from-bottom duration-300 max-w-xl w-[92%]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-300 hidden sm:inline">
              So sánh ({compareItems.length}/4):
            </span>
            <div className="flex -space-x-2 overflow-hidden">
              {compareItems.map(item => (
                <img
                  key={item.id}
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-8 h-8 rounded-full border-2 border-[#1e1e1e] object-cover bg-white"
                />
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              style={{ backgroundColor: '#e30019' }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-black text-white hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Xem bảng so sánh</span>
            </button>
            <button
              onClick={() => setCompareItems([])}
              className="px-2.5 py-1.5 rounded-xl text-xs text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              Xóa
            </button>
          </div>
        </div>
      )}

      {/* Floating Lucky Spin Wheel Trigger */}
      <div className="fixed right-4 bottom-24 z-30">
        <button
          onClick={() => setIsLuckyWheelOpen(true)}
          className="group relative flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-gradient-to-r from-[#e30019] to-red-600 text-white font-black text-xs shadow-[0_8px_25px_rgba(227,0,25,0.4)] hover:shadow-[0_10px_30px_rgba(227,0,25,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-yellow-400/40"
        >
          <div className="w-7 h-7 rounded-full bg-yellow-400 text-black flex items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
            <Gift className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-left leading-tight hidden sm:block">
            <div className="text-[10px] text-yellow-300 font-extrabold uppercase">100% Trúng quà</div>
            <div className="text-xs font-black tracking-wide">Vòng Quay GVN</div>
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        </button>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenAuth={onOpenAuth}
        onOpenCart={onOpenCart}
        onToast={onToast}
      />

      {/* Product Compare Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        compareItems={compareItems}
        onRemoveItem={(id) => setCompareItems(prev => prev.filter(p => p.id !== id))}
        onClearAll={() => setCompareItems([])}
        onAddToCart={(p) => {
          onAddToCart(p);
          onToast?.('success', `Đã thêm ${p.name} vào giỏ hàng`);
        }}
      />

      {/* Lucky Wheel Modal */}
      <LuckyWheelModal
        isOpen={isLuckyWheelOpen}
        onClose={() => setIsLuckyWheelOpen(false)}
      />
    </main>
  );
};

export default HomePage;
