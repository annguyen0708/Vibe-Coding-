import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ShoppingCart, User, LogOut, LayoutDashboard,
  ChevronDown, X, Menu, Laptop, Keyboard, Headphones, Sparkles, Heart, Truck,
  Phone, MapPin, Clock, Flame, Monitor, Mouse, Cpu, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';

const QUICK_LINKS = [
  { label: 'Khuyến mãi HOT', catId: null, icon: Flame, isHot: true },
  { label: 'Laptop & Workstation', catId: 1, icon: Laptop },
  { label: 'Màn hình Gaming & Đồ họa', catId: 4, icon: Monitor },
  { label: 'Chuột & Bàn di Gaming', catId: 5, icon: Mouse },
  { label: 'Bàn phím cơ Custom', catId: 2, icon: Keyboard },
  { label: 'Gaming Gear & Audio', catId: 3, icon: Headphones },
];

const Navbar = ({
  onSearch,
  onCategoryFilter,
  activeCategory,
  onOpenCart,
  onOpenAuth,
  onOpenWishlist,
  onOpenOrderHistory,
  onOpenPCBuilder
}) => {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchInputRef = useRef(null);

  // Fetch categories
  useEffect(() => {
    api.get('/api/products/categories')
      .then(r => setCategories(r.data))
      .catch(() => {});
  }, []);

  // Sticky on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Global Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 shadow-md">
      {/* ── Top Bar (Black) ── */}
      <div className="bg-[#111111] text-gray-300 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-8 text-[11px]">
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-gray-300">
                <Phone className="w-3 h-3 text-[#e30019]" />
                <span>Hotline: <strong className="text-white hover:text-yellow-400 transition-colors">1800.6975</strong> (Miễn phí)</span>
              </span>
              <span className="hidden sm:flex items-center gap-1.5 text-gray-400">
                <Clock className="w-3 h-3 text-[#e30019]" />
                <span>8:00 - 21:30 (T2 - CN)</span>
              </span>
            </div>

            <div className="flex items-center gap-5">
              <span className="hidden md:flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors cursor-pointer">
                <MapPin className="w-3 h-3 text-[#e30019]" />
                <span>Hệ thống Showroom toàn quốc</span>
              </span>
              <button
                type="button"
                onClick={onOpenOrderHistory}
                className="flex items-center gap-1.5 text-gray-300 hover:text-yellow-400 transition-colors cursor-pointer"
              >
                <Truck className="w-3 h-3 text-[#e30019]" />
                <span>Tra cứu đơn hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Red Header (GearVN signature #e30019) ── */}
      <div style={{ backgroundColor: '#e30019' }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
            
            {/* Logo GEARVN */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 group py-1">
              <div className="bg-white text-[#e30019] px-2.5 py-1 rounded-lg font-black text-2xl tracking-tighter shadow-sm flex items-center gap-1">
                <span className="italic font-black text-2xl">GEAR</span>
                <span className="bg-[#e30019] text-white px-1.5 py-0.5 rounded text-lg font-black tracking-normal">VN</span>
              </div>
            </Link>

            {/* Catalog Button */}
            <button
              type="button"
              onClick={() => {
                onCategoryFilter(null);
                const el = document.getElementById('product-catalog');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden lg:flex items-center gap-2 px-3.5 py-2.5 bg-black/20 hover:bg-black/30 text-white rounded-lg text-xs font-bold transition-all border border-white/15 cursor-pointer flex-shrink-0"
            >
              <Menu className="w-4 h-4" />
              <span>Danh mục sản phẩm</span>
            </button>

            {/* Big Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-1 sm:mx-2">
              <div className="relative w-full">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Bạn cần tìm sản phẩm gì? (Ví dụ: Laptop RTX 4080, Phím cơ, MacBook...)"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 bg-white rounded-lg text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none shadow-inner"
                />
                <button
                  type="submit"
                  aria-label="Tìm kiếm"
                  style={{ backgroundColor: '#e30019' }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 hover:brightness-110 text-white rounded-md transition-all shadow-sm"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Action Items */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Hotline Quick button */}
              <a
                href="tel:18006975"
                className="hidden xl:flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] text-white/80 leading-none">Gọi mua hàng</p>
                  <p className="text-xs font-extrabold text-white leading-tight">1800.6975</p>
                </div>
              </a>

              {/* Wishlist */}
              <button
                id="wishlist-btn"
                type="button"
                onClick={onOpenWishlist}
                className="relative flex flex-col items-center justify-center px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white"
                title="Sản phẩm yêu thích"
              >
                <div className="relative">
                  <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-white text-white' : 'text-white'}`} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-yellow-400 text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">
                      {wishlist.length > 9 ? '9+' : wishlist.length}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold hidden md:block mt-0.5">Yêu thích</span>
              </button>

              {/* Cart Button */}
              <button
                id="cart-btn"
                type="button"
                onClick={onOpenCart}
                className="relative flex items-center gap-2 px-3 py-2 bg-black/25 hover:bg-black/35 rounded-lg border border-white/20 transition-all text-white font-bold text-xs"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 text-white" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2.5 w-4 h-4 bg-yellow-400 text-black text-[9px] font-black rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Giỏ hàng</span>
              </button>

              {/* User Account */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white font-semibold text-xs"
                  >
                    <div className="w-7 h-7 rounded-full bg-white text-[#e30019] flex items-center justify-center font-bold text-xs">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="max-w-[70px] truncate hidden md:inline">{user?.fullName?.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-80" />
                  </button>

                  {/* Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl py-2 z-50 text-gray-800 border border-gray-200 animate-in fade-in-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">{user?.fullName}</p>
                        <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#e30019] hover:bg-red-50 transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span>Trang Quản trị Admin</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenOrderHistory();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5 text-gray-500" />
                        <span>Đơn hàng của tôi</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="auth-btn"
                  type="button"
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub Navigation Links Bar (Dark) ── */}
      <div className="bg-[#1f1f1f] text-gray-300 border-b border-gray-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-xs">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-1">
              {QUICK_LINKS.map((link, idx) => {
                const IconComponent = link.icon;
                const isActive = activeCategory === link.catId && link.catId !== null;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onCategoryFilter(link.catId);
                      const el = document.getElementById('product-catalog');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium text-xs transition-all whitespace-nowrap cursor-pointer ${
                      link.isHot
                        ? 'text-yellow-400 hover:text-yellow-300 font-bold bg-yellow-400/10'
                        : isActive
                        ? 'bg-[#e30019] text-white font-bold'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${link.isHot ? 'text-yellow-400 animate-pulse' : ''}`} />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-3 text-[11px] text-gray-400">
              <button
                type="button"
                onClick={onOpenPCBuilder}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black text-white bg-[#e30019] hover:brightness-110 shadow-sm transition-all animate-pulse"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>🛠️ Xây dựng cấu hình PC</span>
              </button>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Chính hãng
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
