import { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, X } from 'lucide-react';

const RECENT_ORDERS = [
  { customer: 'Nguyễn T.', city: 'TP.HCM', item: 'ASUS ROG Zephyrus G16 OLED', time: '1 phút trước', img: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=150&q=80' },
  { customer: 'Trần H.', city: 'Hà Nội', item: 'Apple MacBook Pro 16" M3 Max', time: '3 phút trước', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=150&q=80' },
  { customer: 'Lê V.', city: 'Đà Nẵng', item: 'Bàn phím cơ Keychron Q1 Pro', time: '5 phút trước', img: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=150&q=80' },
  { customer: 'Phạm M.', city: 'Cần Thơ', item: 'Lenovo Legion Pro 7i Gen 9', time: '7 phút trước', img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=150&q=80' },
  { customer: 'Hoàng K.', city: 'Hải Phòng', item: 'Tai nghe Sony WH-1000XM5', time: '9 phút trước', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80' },
];

const LiveOrderToast = () => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let index = 0;
    
    // First toast after 4s
    const firstTimer = setTimeout(() => {
      setCurrentOrder(RECENT_ORDERS[0]);
      setVisible(true);
    }, 4000);

    // Hide after 5s
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        index = (index + 1) % RECENT_ORDERS.length;
        setCurrentOrder(RECENT_ORDERS[index]);
        setVisible(true);
      }, 4000); // 4s gap between notifications
    }, 12000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  if (!currentOrder || !visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-30 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-3 shadow-2xl flex items-center gap-3 relative">
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute -top-1.5 -right-1.5 p-1 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-700 shadow-sm"
        >
          <X className="w-3 h-3" />
        </button>

        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 p-1 flex-shrink-0 flex items-center justify-center">
          <img
            src={currentOrder.img}
            alt={currentOrder.item}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-0.5">
            <span className="font-bold text-gray-900">{currentOrder.customer}</span>
            <span>•</span>
            <span>{currentOrder.city}</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">{currentOrder.time}</span>
          </div>
          <p className="text-xs font-bold text-gray-900 truncate">
            {currentOrder.item}
          </p>
          <p className="text-[10px] text-[#e30019] font-black flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Vừa đặt hàng thành công
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveOrderToast;
