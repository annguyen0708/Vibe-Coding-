import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const formatVND = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';

const WishlistDrawer = ({ isOpen, onClose, onToast }) => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  if (!isOpen) return null;

  const handleMoveToCart = (product) => {
    addItem(product, 1);
    onToast?.(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Top highlight bar */}
          <div className="h-1 bg-primary w-full" />

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary fill-primary" />
              </div>
              <div>
                <h2 className="text-gray-900 font-bold text-base">Sản phẩm yêu thích</h2>
                <p className="text-gray-500 text-xs">
                  {wishlist.length > 0 ? `${wishlist.length} sản phẩm đã lưu` : 'Chưa có sản phẩm nào'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {wishlist.length > 0 && (
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="text-xs text-gray-400 hover:text-primary transition-colors px-2 py-1 font-medium"
                >
                  Xóa hết
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50/60">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                  <Heart className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-gray-900 font-bold text-base mb-1">Chưa có sản phẩm yêu thích</h3>
                  <p className="text-gray-500 text-xs max-w-xs">
                    Nhấn vào biểu tượng trái tim trên các sản phẩm công nghệ để lưu lại danh sách quan tâm nhé!
                  </p>
                </div>
              </div>
            ) : (
              wishlist.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-white hover:border-primary-200 border border-gray-200 rounded-2xl flex items-center gap-3 transition-colors shadow-sm"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 p-1 flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-gray-900 text-xs font-semibold truncate mb-1">
                      {item.name}
                    </h4>
                    <p className="text-primary text-xs font-bold mb-2">
                      {formatVND(item.price)}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleMoveToCart(item)}
                      className="px-3 py-1.5 bg-primary hover:bg-primary-700 text-white text-[11px] font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>Chuyển vào giỏ</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary-50 transition-colors"
                    title="Xóa khỏi yêu thích"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistDrawer;
