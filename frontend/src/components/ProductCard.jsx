import { useState } from 'react';
import { ShoppingCart, Eye, Sparkles, Flame, Check, Heart, Star, Gift, ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const formatVND = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';

const ProductCard = ({ product, onAddToCart, onOpenAuth, onQuickView, onToggleCompare, isCompared }) => {
  const { isLoggedIn } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      onOpenAuth?.();
      return;
    }
    onAddToCart?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleToggleFav = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isOutOfStock = product.stockQuantity === 0;
  const isHot = product.price > 50000000 || [1, 2, 8, 15, 16].includes(product.id);
  const isNew = [4, 6, 11, 12, 19, 20].includes(product.id);

  // Discount calculation
  const originalPrice = Math.round(product.price * 1.15);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200 hover:border-[#e30019]/50 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-3">
      
      {/* Top Image Box */}
      <div>
        <div
          className="relative overflow-hidden aspect-[4/3] rounded-xl bg-gray-50 cursor-pointer p-2 flex items-center justify-center mb-2"
          onClick={() => onQuickView?.(product)}
        >
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = FALLBACK_IMAGE;
            }}
          />

          {/* Wishlist Heart */}
          <button
            type="button"
            onClick={handleToggleFav}
            className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-white/90 hover:bg-white border border-gray-200 hover:scale-110 active:scale-95 transition-all shadow-sm"
            title={isFavorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFavorited
                  ? 'text-[#e30019] fill-[#e30019]'
                  : 'text-gray-400 hover:text-[#e30019]'
              }`}
            />
          </button>

          {/* Quick View Overlay Button */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onQuickView?.(product); }}
              className="px-3 py-1.5 bg-white hover:bg-[#e30019] hover:text-white text-gray-800 text-[11px] font-bold rounded-lg shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Xem nhanh</span>
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
            {discountPercent > 0 && (
              <span className="px-1.5 py-0.5 bg-[#e30019] text-white text-[9px] font-black rounded shadow-sm w-fit">
                -{discountPercent}%
              </span>
            )}
            {isHot && (
              <span className="px-1.5 py-0.5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[9px] font-extrabold rounded flex items-center gap-0.5 w-fit shadow-sm">
                <Flame className="w-2.5 h-2.5" /> HOT
              </span>
            )}
            {isNew && !isHot && (
              <span className="px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-extrabold rounded flex items-center gap-0.5 w-fit shadow-sm">
                <Sparkles className="w-2.5 h-2.5" /> MỚI
              </span>
            )}
          </div>
        </div>

        {/* Brand & Stars */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
          <span className="font-bold uppercase tracking-wider text-gray-500">
            {product.categoryName || 'Chính hãng'}
          </span>
          <div className="flex items-center gap-0.5 text-yellow-500 font-bold">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>5.0</span>
          </div>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onQuickView?.(product)}
          className="text-gray-900 font-bold text-xs sm:text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-[#e30019] transition-colors cursor-pointer"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Gift promo badge & Compare Button */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold truncate flex-1">
            <Gift className="w-3 h-3 text-emerald-600 flex-shrink-0" />
            <span className="truncate">Tặng Quà GVN</span>
          </div>
          {onToggleCompare && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product);
              }}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                isCompared
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
              title={isCompared ? 'Bỏ so sánh' : 'Thêm vào so sánh'}
            >
              <ArrowRightLeft className="w-2.5 h-2.5" />
              <span>{isCompared ? 'Đã chọn' : 'So sánh'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Pricing & Add to Cart Action */}
      <div className="pt-2 border-t border-gray-100">
        <div className="mb-2">
          <p className="text-[#e30019] font-black text-sm sm:text-base">
            {formatVND(product.price)}
          </p>
          <p className="text-gray-400 text-[11px] line-through font-medium">
            {formatVND(originalPrice)}
          </p>
        </div>

        <button
          id={`add-to-cart-${product.id}`}
          type="button"
          onClick={handleAdd}
          disabled={isOutOfStock}
          style={{ backgroundColor: added ? '#059669' : isOutOfStock ? '#e5e7eb' : '#e30019' }}
          className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-white transition-all duration-200 active:scale-95 shadow-sm hover:brightness-110 cursor-pointer ${
            isOutOfStock ? 'text-gray-400 cursor-not-allowed' : ''
          }`}
        >
          {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
          <span>{added ? 'Đã thêm giỏ!' : isOutOfStock ? 'Tạm hết hàng' : 'Thêm vào giỏ'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
