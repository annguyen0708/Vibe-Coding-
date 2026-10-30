import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, BarChart3, Plus, Pencil, Trash2,
  X, ChevronDown, Loader2, DollarSign, Users, TrendingUp, Clock, Check,
  AlertCircle, RefreshCw, LogOut, AlertTriangle, ArrowUpDown, Eye, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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

const StatusBadge = ({ status }) => {
  const config = {
    Pending:    { label: 'Chờ duyệt',  color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
    Processing: { label: 'Đang xử lý', color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30' },
    Completed:  { label: 'Hoàn thành', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' },
  };
  const c = config[status] || { label: status, color: 'text-slate-400 bg-slate-500/15 border-slate-500/30' };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-bold border ${c.color}`}>
      {c.label}
    </span>
  );
};

// ─── Product CRUD Modal ──────────────────────────────────────────────────────
const ProductModal = ({ isOpen, onClose, product, categories, onSave }) => {
  const [form, setForm] = useState({
    name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stockQuantity: product.stockQuantity?.toString() || '',
        imageUrl: product.imageUrl || '',
        categoryId: product.categoryId?.toString() || ''
      });
    } else {
      setForm({
        name: '',
        description: '',
        price: '',
        stockQuantity: '20',
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
        categoryId: categories[0]?.id?.toString() || '1'
      });
    }
    setError('');
  }, [product, isOpen, categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        stockQuantity: parseInt(form.stockQuantity, 10),
        imageUrl: form.imageUrl.trim(),
        categoryId: parseInt(form.categoryId, 10)
      };

      if (product) {
        await api.put(`/api/products/${product.id}`, payload);
      } else {
        await api.post('/api/products', payload);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <h2 className="text-white font-bold text-base sm:text-lg">
              {product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/15 border border-red-500/30 rounded-xl text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Tên sản phẩm *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="VD: MacBook Pro 16 M3 Max, Bàn phím Rainy 75..."
              required
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Danh mục công nghệ *
            </label>
            <select
              value={form.categoryId}
              onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
              required
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Giá bán (VNĐ) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                required
                min="1000"
                step="1000"
                placeholder="25000000"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
                Số lượng tồn kho *
              </label>
              <input
                type="number"
                value={form.stockQuantity}
                onChange={e => setForm(p => ({ ...p, stockQuantity: e.target.value }))}
                required
                min="0"
                placeholder="10"
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              URL hình ảnh sản phẩm (Unsplash/CDN)
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">
              Mô tả chi tiết sản phẩm *
            </label>
            <textarea
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              required
              rows={3}
              placeholder="Mô tả cấu hình, switch, chất liệu, tính năng nổi bật..."
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Preview Image */}
          {form.imageUrl && (
            <div className="rounded-xl overflow-hidden border border-slate-700 h-32 bg-slate-950">
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer shadow-lg shadow-indigo-500/25"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {saving ? 'Đang lưu...' : product ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Admin Dashboard Component ──────────────────────────────────────────
const AdminDashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders'); // default to orders as requested
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productModal, setProductModal] = useState({ open: false, product: null });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [seedingOrder, setSeedingOrder] = useState(false);

  useEffect(() => {
    // If not admin, redirect
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/stats');
      setStats(res.data);
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/products/categories')
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
    } catch {
      // Ignored
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/orders');
      setOrders(res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'stats') loadStats();
    else if (activeTab === 'products') loadProducts();
    else if (activeTab === 'orders') loadOrders();
  }, [activeTab, loadStats, loadProducts, loadOrders]);

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/api/products/${id}`);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể xóa sản phẩm này.');
    }
    setDeleteConfirm(null);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch {
      alert('Cập nhật trạng thái đơn hàng thất bại.');
    }
  };

  // Seed sample order if table is empty
  const handleSeedSampleOrder = async () => {
    setSeedingOrder(true);
    try {
      // Use client placing order endpoint
      await api.post('/api/orders', {
        items: [
          { productId: 2, quantity: 1 },
          { productId: 8, quantity: 1 }
        ]
      });
      await loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Không thể tạo đơn mẫu lúc này.');
    } finally {
      setSeedingOrder(false);
    }
  };

  const navItems = [
    { key: 'orders', label: 'Quản lý đơn hàng', icon: ShoppingBag, badge: orders.length },
    { key: 'products', label: 'Quản lý sản phẩm', icon: Package, badge: products.length },
    { key: 'stats', label: 'Báo cáo tổng quan', icon: BarChart3 },
  ];

  const kpiCards = stats ? [
    {
      label: 'Doanh thu',
      value: formatVND(stats.totalRevenue),
      icon: DollarSign,
      gradient: 'from-indigo-600 to-violet-600',
      glow: 'shadow-indigo-500/20',
      sub: 'Đơn hoàn thành'
    },
    {
      label: 'Tổng đơn hàng',
      value: stats.totalOrders,
      icon: ShoppingBag,
      gradient: 'from-cyan-600 to-blue-600',
      glow: 'shadow-cyan-500/20',
      sub: `${stats.pendingOrders} đang chờ duyệt`
    },
    {
      label: 'Khách hàng',
      value: stats.totalCustomers,
      icon: Users,
      gradient: 'from-emerald-600 to-teal-600',
      glow: 'shadow-emerald-500/20',
      sub: 'Tài khoản hoạt động'
    },
  ] : [];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-white font-bold text-center text-base mb-1">Xác nhận xóa sản phẩm</h3>
            <p className="text-slate-400 text-xs text-center mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa sản phẩm này khỏi cơ sở dữ liệu? Thao tác này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-rose-500/30"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col md:sticky md:top-0 md:h-screen flex-shrink-0 z-30">
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm">TechStore Admin</p>
              <p className="text-slate-400 text-[10px] font-mono">Control Center v2.4</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map(item => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === item.key
                  ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-cyan-300" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeTab === item.key ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>Xem cửa hàng TechStore</span>
          </button>
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        
        {/* ─── ORDERS TAB ─── */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <span>Quản lý đơn hàng</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                    {orders.length} đơn
                  </span>
                </h1>
                <p className="text-slate-400 text-xs mt-1">
                  Kiểm duyệt, theo dõi tiến trình và cập nhật trạng thái đơn hàng thời gian thực
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={loadOrders}
                  disabled={loading}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Làm mới danh sách</span>
                </button>
              </div>
            </div>

            {/* Orders Table or Empty State */}
            {loading && orders.length === 0 ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              /* EMPTY STATE CONTAINER */
              <div className="py-20 text-center bg-slate-900/60 border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto shadow-2xl">
                <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Chưa có đơn hàng nào</h3>
                <p className="text-xs text-slate-400 mb-6 max-w-xs mx-auto leading-relaxed">
                  Hệ thống chưa ghi nhận đơn đặt hàng nào trong cơ sở dữ liệu. Bạn có thể nhấn nút bên dưới để tạo ngay đơn hàng mẫu thử nghiệm.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleSeedSampleOrder}
                    disabled={seedingOrder}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
                  >
                    {seedingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    <span>{seedingOrder ? 'Đang tạo...' : 'Tạo đơn mẫu'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={loadOrders}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
                  >
                    Làm mới danh sách
                  </button>
                </div>
              </div>
            ) : (
              /* ORDERS TABLE */
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="px-5 py-4">Mã đơn</th>
                        <th className="px-5 py-4">Khách hàng</th>
                        <th className="px-5 py-4">Ngày đặt</th>
                        <th className="px-5 py-4">Tổng tiền (VNĐ)</th>
                        <th className="px-5 py-4">Trạng thái</th>
                        <th className="px-5 py-4 text-right">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {orders.map(order => {
                        const isExpanded = expandedOrder === order.id;
                        const formattedId = `#ORD-${String(order.id).padStart(3, '0')}`;
                        return (
                          <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                            {/* Order ID */}
                            <td className="px-5 py-4 font-mono font-bold text-cyan-300">
                              <button
                                type="button"
                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                className="flex items-center gap-1.5 hover:underline cursor-pointer"
                              >
                                <span>{formattedId}</span>
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                              </button>
                            </td>

                            {/* Customer */}
                            <td className="px-5 py-4">
                              <p className="font-semibold text-white">{order.userName || 'Khách vãng lai'}</p>
                              <p className="text-[11px] text-slate-400">{order.userEmail || 'Chưa có email'}</p>
                            </td>

                            {/* Date */}
                            <td className="px-5 py-4 text-slate-300 whitespace-nowrap">
                              {formatDate(order.orderDate)}
                            </td>

                            {/* Total Amount */}
                            <td className="px-5 py-4 font-bold text-indigo-300 text-sm whitespace-nowrap">
                              {formatVND(order.totalAmount)}
                            </td>

                            {/* Status Badge */}
                            <td className="px-5 py-4">
                              <StatusBadge status={order.status} />
                            </td>

                            {/* Status Changer Dropdown */}
                            <td className="px-5 py-4 text-right">
                              <select
                                value={order.status}
                                onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="bg-slate-800 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-1.5 cursor-pointer focus:outline-none focus:border-cyan-400"
                              >
                                <option value="Pending">Chờ duyệt</option>
                                <option value="Processing">Đang xử lý</option>
                                <option value="Completed">Hoàn thành</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Expanded Order Items Viewer */}
                {expandedOrder && (
                  <div className="p-4 bg-slate-950/80 border-t border-slate-800 animate-in slide-in-from-top-2">
                    {(() => {
                      const cur = orders.find(o => o.id === expandedOrder);
                      if (!cur) return null;
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                              Chi tiết kiện hàng #{cur.id} ({cur.items?.length || 0} sản phẩm)
                            </span>
                            <button
                              type="button"
                              onClick={() => setExpandedOrder(null)}
                              className="text-xs text-slate-400 hover:text-white"
                            >
                              Đóng
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {cur.items?.map(it => (
                              <div
                                key={it.id}
                                className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-semibold text-white text-xs">{it.productName}</p>
                                  <p className="text-slate-400 text-[11px]">SL: x{it.quantity} · {formatVND(it.unitPrice)}</p>
                                </div>
                                <span className="text-xs font-bold text-cyan-300">
                                  {formatVND(it.unitPrice * it.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ─── PRODUCTS TAB (FULL CRUD) ─── */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <span>Quản lý sản phẩm</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                    {products.length} sản phẩm
                  </span>
                </h1>
                <p className="text-slate-400 text-xs mt-1">
                  Thêm, sửa giá, điều chỉnh tồn kho và cảnh báo sản phẩm sắp hết hàng
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={loadProducts}
                  disabled={loading}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Làm mới</span>
                </button>
                <button
                  id="add-product-btn"
                  type="button"
                  onClick={() => setProductModal({ open: true, product: null })}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm sản phẩm mới</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="px-5 py-4">Sản phẩm</th>
                      <th className="px-5 py-4 hidden md:table-cell">Danh mục</th>
                      <th className="px-5 py-4">Giá bán (VNĐ)</th>
                      <th className="px-5 py-4">Tồn kho / Trạng thái</th>
                      <th className="px-5 py-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {loading && products.length === 0 ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i}>
                          <td colSpan={5} className="px-5 py-4">
                            <div className="h-10 bg-slate-800/50 rounded-lg animate-pulse" />
                          </td>
                        </tr>
                      ))
                    ) : (
                      products.map(p => {
                        const isLowStock = p.stockQuantity < 5;
                        return (
                          <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                            {/* Product Info */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-white/5 flex-shrink-0">
                                  <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                    onError={e => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
                                    }}
                                  />
                                </div>
                                <div className="min-w-0 max-w-[220px]">
                                  <p className="text-white font-bold truncate">{p.name}</p>
                                  <p className="text-slate-400 text-[11px] truncate">{p.description}</p>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="px-5 py-4 hidden md:table-cell">
                              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium border border-slate-700/60">
                                {p.categoryName}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="px-5 py-4 font-bold text-cyan-300 text-sm whitespace-nowrap">
                              {formatVND(p.price)}
                            </td>

                            {/* Stock Quantity with Warning Badge */}
                            <td className="px-5 py-4 whitespace-nowrap">
                              {isLowStock ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                                  <span>Chỉ còn {p.stockQuantity} món</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Còn {p.stockQuantity} món</span>
                                </span>
                              )}
                            </td>

                            {/* Actions: Edit & Delete */}
                            <td className="px-5 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setProductModal({ open: true, product: p })}
                                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
                                  title="Chỉnh sửa giá / tồn kho"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirm(p.id)}
                                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-600 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
                                  title="Xóa sản phẩm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── STATS TAB ─── */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white">Báo cáo kinh doanh tổng hợp</h1>
                <p className="text-slate-400 text-xs mt-1">Dữ liệu doanh số & tăng trưởng thời gian thực</p>
              </div>
              <button
                type="button"
                onClick={loadStats}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-all"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kpiCards.map(card => (
                <div
                  key={card.label}
                  className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-3xl p-6 shadow-2xl ${card.glow}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">{card.label}</p>
                  <p className="text-white font-black text-2xl sm:text-3xl mb-1 truncate">{card.value}</p>
                  <p className="text-white/60 text-xs font-medium">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Product Add/Edit Modal */}
      <ProductModal
        isOpen={productModal.open}
        onClose={() => setProductModal({ open: false, product: null })}
        product={productModal.product}
        categories={categories}
        onSave={loadProducts}
      />
    </div>
  );
};

export default AdminDashboard;
