import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import OrderHistoryModal from './components/OrderHistoryModal';
import PCBuilderModal from './components/PCBuilderModal';
import LiveOrderToast from './components/LiveOrderToast';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import { CheckCircle, X } from 'lucide-react';

// ─── Toast Notification ──────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="fixed top-5 right-5 z-[100] animate-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-white border border-green-200 rounded-xl shadow-2xl max-w-sm">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <p className="text-gray-800 text-sm font-medium flex-1">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Footer Component (GearVN Style) ────────────────────────────────────────
const Footer = () => (
  <footer className="bg-[#141414] text-gray-300 border-t border-gray-800 mt-12">
    {/* Features strip */}
    <div className="border-b border-gray-800 bg-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center text-[#e30019]">
              <span className="text-2xl">🚚</span>
            </div>
            <div>
              <p className="text-white text-sm font-bold">Giao hàng miễn phí</p>
              <p className="text-gray-400 text-xs">Toàn quốc cho đơn từ 500K</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center text-[#e30019]">
              <span className="text-2xl">🛡️</span>
            </div>
            <div>
              <p className="text-white text-sm font-bold">Bảo hành chính hãng</p>
              <p className="text-gray-400 text-xs">Từ 12 đến 36 tháng tận nơi</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center text-[#e30019]">
              <span className="text-2xl">🔄</span>
            </div>
            <div>
              <p className="text-white text-sm font-bold">Đổi trả trong 30 ngày</p>
              <p className="text-gray-400 text-xs">1 đổi 1 nếu sản phẩm phát sinh lỗi</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center text-[#e30019]">
              <span className="text-2xl">💬</span>
            </div>
            <div>
              <p className="text-white text-sm font-bold">Hỗ trợ 24/7</p>
              <p className="text-gray-400 text-xs">Hotline miễn phí: 1800.6975</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Main footer content */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white text-[#e30019] px-2.5 py-1 rounded-lg font-black text-xl tracking-tighter">
              <span className="italic font-black">GEAR</span>
              <span className="bg-[#e30019] text-white px-1.5 py-0.5 rounded text-sm font-black ml-1">VN</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed mb-4">
            Hệ thống bán lẻ thiết bị Gaming Gear, Laptop cao cấp, Bàn phím cơ Custom và Linh kiện máy tính hàng đầu Việt Nam.
          </p>
          <div className="space-y-1.5 text-xs text-gray-400">
            <p>📍 Showroom HCM: 78-80 Hoàng Hoa Thám, P.12, Tân Bình</p>
            <p>📍 Showroom Hà Nội: 162 Thái Hà, P.Trung Liệt, Đống Đa</p>
            <p>📞 Tổng đài: <strong className="text-white">1800.6975</strong></p>
          </div>
        </div>

        {/* Col 2: Policies */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-[#e30019] pl-2.5">
            Chính sách bán hàng
          </h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="hover:text-white cursor-pointer transition-colors">Chính sách bảo hành chính hãng</li>
            <li className="hover:text-white cursor-pointer transition-colors">Chính sách đổi trả 1 - 1</li>
            <li className="hover:text-white cursor-pointer transition-colors">Chính sách giao hàng hỏa tốc</li>
            <li className="hover:text-white cursor-pointer transition-colors">Hướng dẫn mua hàng trả góp 0%</li>
            <li className="hover:text-white cursor-pointer transition-colors">Quy định bảo mật thông tin</li>
          </ul>
        </div>

        {/* Col 3: Support */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-[#e30019] pl-2.5">
            Dịch vụ & Hỗ trợ
          </h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="hover:text-white cursor-pointer transition-colors">Xây dựng cấu hình PC Gaming</li>
            <li className="hover:text-white cursor-pointer transition-colors">Dịch vụ vệ sinh & tra keo tản nhiệt</li>
            <li className="hover:text-white cursor-pointer transition-colors">Tra cứu tiến độ bảo hành</li>
            <li className="hover:text-white cursor-pointer transition-colors">Bảng giá thu cũ đổi mới</li>
            <li className="hover:text-white cursor-pointer transition-colors">Hợp tác doanh nghiệp (B2B)</li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div>
          <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4 border-l-2 border-[#e30019] pl-2.5">
            Đăng ký nhận khuyến mãi
          </h4>
          <p className="text-gray-400 text-xs mb-3">
            Nhận ngay voucher giảm giá 500.000đ và thông tin Deal Hot công nghệ sớm nhất.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="flex-1 px-3 py-2 bg-[#262626] border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#e30019]"
            />
            <button
              type="button"
              style={{ backgroundColor: '#e30019' }}
              className="px-3.5 py-2 hover:brightness-110 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom copyright */}
    <div className="border-t border-gray-800 bg-[#0d0d0d] py-4 text-center text-xs text-gray-500">
      <p>© 2026 GEARVN — Hệ thống Thiết bị Gaming & Công nghệ Cao cấp hàng đầu Việt Nam.</p>
    </div>
  </footer>
);

// ─── Main Layout Component ───────────────────────────────────────────────────
const MainLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryId, setCategoryId] = useState(null);
  const [toast, setToast] = useState('');

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isPCBuilderOpen, setIsPCBuilderOpen] = useState(false);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  }, []);

  const handleAddToCart = useCallback((product) => {
    showToast(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
  }, [showToast]);

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-800 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        onSearch={setSearchQuery}
        onCategoryFilter={setCategoryId}
        activeCategory={categoryId}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrderHistory={() => setIsOrderHistoryOpen(true)}
        onOpenPCBuilder={() => setIsPCBuilderOpen(true)}
      />

      {/* Main Content */}
      <HomePage
        searchQuery={searchQuery}
        categoryId={categoryId}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onAddToCart={handleAddToCart}
        onToast={showToast}
      />

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenAuth={() => {
          setIsCartOpen(false);
          setIsAuthOpen(true);
        }}
        onOrderSuccess={(msg) => showToast(msg)}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onToast={showToast}
      />

      {/* Order History Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
        onOpenAuth={() => {
          setIsOrderHistoryOpen(false);
          setIsAuthOpen(true);
        }}
      />

      {/* PC Builder Custom Rig Modal */}
      <PCBuilderModal
        isOpen={isPCBuilderOpen}
        onClose={() => setIsPCBuilderOpen(false)}
        onToast={showToast}
      />

      {/* Live Social Proof Order Toast */}
      <LiveOrderToast />

      {/* Chat Widget */}
      <ChatWidget onToast={showToast} />

      {/* Toast Notification */}
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
};

// ─── App Root ─────────────────────────────────────────────────────────────────
const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route path="/" element={<MainLayout />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
