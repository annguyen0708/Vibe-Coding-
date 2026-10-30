import { useState } from 'react';
import { X, Eye, EyeOff, User, Mail, Lock, Loader2, AlertCircle, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDemo, setSelectedDemo] = useState(null);

  const reset = () => {
    setForm({ fullName: '', email: '', password: '' });
    setError('');
    setShowPassword(false);
    setSelectedDemo(null);
  };

  const switchMode = (m) => { setMode(m); reset(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.fullName, form.email, form.password);
        await login(form.email, form.password);
      }
      onClose();
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role, email, password) => {
    setForm({ fullName: role === 'admin' ? 'Super Admin' : 'Khách hàng Demo', email, password });
    setSelectedDemo(role);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => { onClose(); reset(); }}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 z-10 animate-in zoom-in-95 duration-200">
        
        {/* Top vibrant GearVN red bar */}
        <div style={{ backgroundColor: '#e30019' }} className="h-1.5 w-full" />

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-[#e30019] text-[11px] font-black uppercase mb-2">
                <span className="italic">GEAR</span><span className="font-bold">VN AUTH</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                {mode === 'login'
                  ? 'Đăng nhập để mua sắm, nhận bảo hành và tích điểm GearVN'
                  : 'Đăng ký ngay để nhận ưu đãi thành viên độc quyền'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => { onClose(); reset(); }}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-xl mb-5 border border-gray-200">
            <button
              type="button"
              onClick={() => switchMode('login')}
              style={mode === 'login' ? { backgroundColor: '#e30019', color: '#ffffff' } : {}}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all duration-200 ${
                mode === 'login'
                  ? 'shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Đăng nhập
            </button>

            <button
              type="button"
              onClick={() => switchMode('register')}
              style={mode === 'register' ? { backgroundColor: '#e30019', color: '#ffffff' } : {}}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all duration-200 ${
                mode === 'register'
                  ? 'shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Error notice */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Họ và tên của bạn</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.fullName}
                    onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-[#e30019] focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Email tài khoản</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-[#e30019] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-gray-700">Mật khẩu</label>
                {mode === 'login' && (
                  <span className="text-[11px] text-[#e30019] hover:underline cursor-pointer">
                    Quên mật khẩu?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-[#e30019] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#e30019', color: '#ffffff' }}
              className="w-full py-3 rounded-xl font-black text-xs sm:text-sm shadow-lg shadow-red-500/25 hover:brightness-110 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Đang xử lý...
                </>
              ) : (
                mode === 'login' ? 'ĐĂNG NHẬP NGAY' : 'TẠO TÀI KHOẢN GEARVN'
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          {mode === 'login' && (
            <div className="mt-5 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl">
              <p className="text-gray-600 text-xs font-bold mb-2 flex items-center justify-between">
                <span>⚡ Chọn nhanh tài khoản dùng thử:</span>
                <span className="text-[10px] text-gray-400">1-Click</span>
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fillDemo('admin', 'admin@store.com', 'Admin@123')}
                  className={`p-2 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                    selectedDemo === 'admin'
                      ? 'border-[#e30019] bg-red-50 text-[#e30019] font-bold'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div>
                    <p className="font-black text-xs">👑 Quản trị viên</p>
                    <p className="text-[10px] text-gray-400">admin@store.com</p>
                  </div>
                  {selectedDemo === 'admin' && <Check className="w-3.5 h-3.5 text-[#e30019]" />}
                </button>

                <button
                  type="button"
                  onClick={() => fillDemo('customer', 'user@store.com', 'User@123')}
                  className={`p-2 rounded-xl text-left border transition-all text-xs flex items-center justify-between ${
                    selectedDemo === 'customer'
                      ? 'border-[#e30019] bg-red-50 text-[#e30019] font-bold'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  <div>
                    <p className="font-black text-xs">👤 Khách hàng</p>
                    <p className="text-[10px] text-gray-400">user@store.com</p>
                  </div>
                  {selectedDemo === 'customer' && <Check className="w-3.5 h-3.5 text-[#e30019]" />}
                </button>
              </div>
            </div>
          )}

          {/* Security footnote */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 mt-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Thông tin được bảo mật chuẩn mã hóa SSL 256-bit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
