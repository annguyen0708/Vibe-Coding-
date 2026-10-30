import { useState, useEffect } from 'react';
import {
  X, Package, Truck, CheckCircle2, Search,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const formatVND = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const formatDate = (dateStr) => {
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

const OrderHistoryModal = ({ isOpen, onClose, onOpenAuth }) => {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isOpen && isLoggedIn) {
      setLoading(true);
      api.get('/api/orders/my-orders')
        .then(res => {
          setOrders(res.data);
          if (res.data.length > 0) setSelectedOrder(res.data[0]);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen, isLoggedIn]);

  if (!isOpen) return null;

  const filteredOrders = orders.filter(o =>
    !searchId.trim() || o.id.toString().includes(searchId.trim().replace('#', ''))
  );

  const getStepStatus = (status) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Processing': return 2;
      case 'Completed': return 3;
      default: return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top bar */}
        <div className="h-1 bg-primary w-full" />

        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-gray-900 font-bold text-base">Tra cứu & Lịch sử đơn hàng</h2>
              <p className="text-gray-500 text-xs">Theo dõi tiến trình vận chuyển đơn hàng GearVN</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isLoggedIn ? (
          <div className="p-12 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">Vui lòng đăng nhập</h3>
            <p className="text-gray-500 text-xs max-w-sm mx-auto">
              Đăng nhập tài khoản GearVN để xem toàn bộ danh sách đơn hàng và lịch trình giao hàng chi tiết.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth?.();
              }}
              className="px-6 py-2.5 bg-primary hover:bg-primary-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-primary/25 transition-all"
            >
              Đăng nhập ngay
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Column: Order List & Search */}
            <div className="md:w-5/12 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col bg-gray-50/70">
              <div className="p-3.5 border-b border-gray-200 bg-white">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Tìm theo mã đơn (#1, #2)..."
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {loading ? (
                  <p className="text-center text-xs text-gray-400 py-8">Đang tải đơn hàng...</p>
                ) : filteredOrders.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    Không có đơn hàng nào khớp tìm kiếm.
                  </div>
                ) : (
                  filteredOrders.map(order => {
                    const isSelected = selectedOrder?.id === order.id;
                    const statusColor =
                      order.status === 'Completed' ? 'text-emerald-700 border-emerald-200 bg-emerald-50' :
                      order.status === 'Processing' ? 'text-blue-700 border-blue-200 bg-blue-50' :
                      'text-amber-700 border-amber-200 bg-amber-50';

                    return (
                      <div
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white border-primary shadow-sm'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-gray-900">Đơn hàng #{order.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusColor}`}>
                            {order.status === 'Completed' ? 'Hoàn thành' :
                             order.status === 'Processing' ? 'Đang giao' : 'Chờ duyệt'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-gray-500">
                          <span>{formatDate(order.orderDate)}</span>
                          <span className="text-primary font-bold">{formatVND(order.totalAmount)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Detailed Order Tracking Timeline & Items */}
            <div className="md:w-7/12 flex-1 p-6 overflow-y-auto bg-white">
              {selectedOrder ? (
                <div className="space-y-6">
                  {/* Order Overview Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <span>Chi tiết Đơn hàng #{selectedOrder.id}</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        Thời gian đặt: {formatDate(selectedOrder.orderDate)}
                      </p>
                    </div>
                    <span className="text-lg font-black text-primary">
                      {formatVND(selectedOrder.totalAmount)}
                    </span>
                  </div>

                  {/* 3-Step Visual Progress Timeline */}
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-4">
                      Tiến trình vận chuyển
                    </p>

                    <div className="relative flex items-center justify-between">
                      {/* Connecting line */}
                      <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-gray-200 -z-0" />
                      <div
                        className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-primary -z-0 transition-all duration-500"
                        style={{
                          width: getStepStatus(selectedOrder.status) === 1 ? '0%' :
                                 getStepStatus(selectedOrder.status) === 2 ? '50%' : '100%'
                        }}
                      />

                      {/* Step 1: Đã đặt */}
                      <div className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                          getStepStatus(selectedOrder.status) >= 1
                            ? 'bg-primary border-primary text-white shadow-md shadow-primary/30'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          ✓
                        </div>
                        <span className="text-[11px] font-semibold text-gray-800 mt-2">Đã đặt hàng</span>
                        <span className="text-[10px] text-gray-400">Xác nhận</span>
                      </div>

                      {/* Step 2: Đang giao */}
                      <div className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                          getStepStatus(selectedOrder.status) >= 2
                            ? 'bg-primary border-primary text-white shadow-md shadow-primary/30'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-800 mt-2">Đang giao hàng</span>
                        <span className="text-[10px] text-gray-400">Hỏa tốc</span>
                      </div>

                      {/* Step 3: Giao thành công */}
                      <div className="flex flex-col items-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                          getStepStatus(selectedOrder.status) === 3
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-500/30'
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-semibold text-gray-800 mt-2">Đã nhận hàng</span>
                        <span className="text-[10px] text-gray-400">Thành công</span>
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Sản phẩm trong kiện hàng ({selectedOrder.items?.length || 0})
                    </p>

                    <div className="space-y-2">
                      {selectedOrder.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-primary font-bold">
                              {item.quantity}x
                            </div>
                            <div>
                              <p className="text-gray-900 font-semibold">{item.productName}</p>
                              <p className="text-gray-500 text-[11px]">{formatVND(item.unitPrice)} / cái</p>
                            </div>
                          </div>
                          <span className="text-gray-900 font-bold">
                            {formatVND(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-gray-400 text-xs">
                  Chọn một đơn hàng bên trái để xem tiến trình.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryModal;
