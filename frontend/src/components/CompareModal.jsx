import { X, Check, Trash2, ShoppingCart, ArrowRightLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CompareModal({ isOpen, onClose, compareItems, onRemoveItem, onClearAll, onAddToCart }) {
  const { addItem } = useCart();

  if (!isOpen) return null;

  const handleAdd = (item) => {
    if (onAddToCart) {
      onAddToCart(item);
    } else {
      addItem(item);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#1a1a1a] to-[#262626] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#e30019] rounded-xl text-white shadow-md">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                SO SÁNH CHI TIẾT SẢN PHẨM
                <span className="px-2 py-0.5 rounded-full text-xs bg-red-600/30 text-red-400 border border-red-500/40">
                  {compareItems.length} sản phẩm
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Đối chiếu thông số kỹ thuật, cấu hình, giá thành & quà tặng kèm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {compareItems.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa tất cả</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-[#f8fafc]">
          {compareItems.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-400">
                <ArrowRightLeft className="w-8 h-8" />
              </div>
              <p className="text-gray-600 font-bold text-base">Chưa có sản phẩm nào để so sánh</p>
              <p className="text-gray-400 text-xs mt-1">
                Bấm vào nút "So sánh" trên các sản phẩm ở trang chủ để đưa vào bảng so sánh.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {compareItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col justify-between relative group hover:shadow-md transition-shadow"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-3 right-3 p-1.5 bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                    title="Xóa khỏi so sánh"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div>
                    {/* Image */}
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 mb-3 border border-gray-100 flex items-center justify-center">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>

                    {/* Category badge */}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#e30019] bg-red-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
                      {item.categoryName || 'Sản phẩm GearVN'}
                    </span>

                    {/* Name */}
                    <h3 className="font-bold text-sm text-gray-900 line-clamp-2 min-h-[40px] mb-2 leading-snug">
                      {item.name}
                    </h3>

                    {/* Price */}
                    <div className="text-lg font-black text-[#e30019] mb-3">
                      {Number(item.price).toLocaleString('vi-VN')} đ
                    </div>

                    {/* Specs / Description Breakdown */}
                    <div className="space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-700">
                      <div>
                        <span className="font-semibold text-gray-500 block text-[11px] mb-0.5">Mô tả chi tiết:</span>
                        <p className="text-gray-700 line-clamp-4 leading-relaxed bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[11px]">
                          {item.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <span className="text-gray-400 block text-[10px]">Tình trạng:</span>
                          <span className="font-bold text-emerald-600">
                            {item.stockQuantity > 0 ? `Còn hàng (${item.stockQuantity})` : 'Tạm hết'}
                          </span>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <span className="text-gray-400 block text-[10px]">Bảo hành:</span>
                          <span className="font-bold text-gray-800">24 Tháng GVN</span>
                        </div>
                      </div>

                      <div className="p-2 bg-red-50 rounded-lg text-[11px] text-red-700 font-medium">
                        🎁 Tặng kèm Balo Gaming + Chuột GVN + Lót chuột
                      </div>
                    </div>
                  </div>

                  {/* Add to cart action */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleAdd(item)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs text-white shadow-md transition-all cursor-pointer hover:brightness-110 active:scale-98"
                      style={{ backgroundColor: '#e30019' }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Thêm vào giỏ</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
