import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, X, Send, Bot, User, Loader2, Sparkles,
  Maximize2, Minimize2, ShoppingCart, Check, ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const formatVND = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';

const SUGGESTION_CHIPS = [
  'Sinh viên CNTT / Lập trình',
  'Laptop Đồ họa & Render',
  'Laptop Gaming RTX 4080',
  'Bàn phím cơ gõ êm',
  'Tai nghe chống ồn',
  'Chuột Gaming siêu nhẹ'
];

const DEFAULT_FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: 'Apple MacBook Pro 16" M3 Max',
    price: 89990000,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
    stockQuantity: 12
  },
  {
    id: 4,
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    price: 54990000,
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80',
    stockQuantity: 10
  },
  {
    id: 2,
    name: 'ASUS ROG Zephyrus G16 (2024) OLED',
    price: 74990000,
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    stockQuantity: 8
  }
];

const ChatWidget = ({ onToast }) => {
  const { addItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '👋 Xin chào bạn! Tôi là **GearVN AI Assistant** - Trợ lý tư vấn công nghệ & thiết bị gaming chính hãng.\n\nTôi có thể hỗ trợ giải đáp chuyên sâu:\n• Cấu hình cho **Sinh viên CNTT / Lập trình viên** (compile code, máy ảo Docker, IDE)\n• Máy cho **Thiết kế Đồ họa / Render 3D / Video 4K** (chuẩn màu DCI-P3, GPU RTX)\n• Cỗ máy chiến **Gaming AAA & eSports** (RTX 4080/4090, màn 240Hz)\n• **Bàn phím cơ Custom**, Tai nghe ANC, Chuột siêu nhẹ\n\nBạn đang quan tâm dòng máy hoặc mức giá nào?',
      products: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [addedMap, setAddedMap] = useState({});

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, loading]);

  const handleSend = async (customText) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/api/chat', { message: textToSend });
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: res.data?.message || 'Dưới đây là một số cấu hình tối ưu nhất tại kho hàng GearVN:',
        products: res.data?.products && res.data.products.length > 0
          ? res.data.products
          : DEFAULT_FALLBACK_PRODUCTS
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: `👋 GearVN AI xin chào bạn! Tôi đã nhận câu hỏi: "${textToSend}". Đây là các mẫu máy chất lượng cao đang được tin dùng nhiều nhất:`,
          products: DEFAULT_FALLBACK_PRODUCTS
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (product) => {
    addItem(product, 1);
    setAddedMap(prev => ({ ...prev, [product.id]: true }));
    onToast?.(`✅ Đã thêm "${product.name}" vào giỏ hàng!`);
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  // Reusable Chat Content Box
  const renderChatBox = () => (
    <div className="w-full h-full bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
      {/* Header */}
      <div style={{ backgroundColor: '#e30019' }} className="px-5 py-3.5 text-white flex items-center justify-between flex-shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
            {/* Pulse Green Online Dot */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 border-2 border-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-black text-sm tracking-tight">GearVN AI Assistant</h3>
              <span className="px-1.5 py-0.2 bg-white/20 text-white text-[10px] rounded font-bold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-white/90">Tư vấn chuyên sâu cấu hình & khuyến mãi</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsMaximized(m => !m)}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
            title={isMaximized ? 'Thu nhỏ' : 'Phóng to'}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors"
            title="Đóng chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#f9fafb]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-[#e30019] shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] space-y-2.5`}>
              {/* Message Bubble */}
              <div
                style={msg.sender === 'user' ? { backgroundColor: '#e30019' } : {}}
                className={`p-3.5 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  msg.sender === 'user'
                    ? 'text-white rounded-tr-sm font-medium'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>

              {/* Suggested Products Carousel/Cards */}
              {msg.products && msg.products.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-black text-gray-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#e30019]" /> Sản phẩm GearVN đề xuất cho bạn:
                  </p>
                  
                  {/* Horizontal Scroll Cards */}
                  <div className="flex gap-2.5 overflow-x-auto pb-2 pt-0.5 scrollbar-hide">
                    {msg.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="w-48 flex-shrink-0 bg-white border border-gray-200 hover:border-[#e30019]/60 rounded-xl p-2.5 flex flex-col justify-between transition-all duration-200 shadow-sm group"
                      >
                        <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-50 border border-gray-100 mb-2 relative flex items-center justify-center p-1">
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = FALLBACK_IMAGE;
                            }}
                          />
                          <div className="absolute top-1 right-1">
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-[9px] font-bold text-emerald-700 rounded border border-emerald-200">
                              Còn {prod.stockQuantity}
                            </span>
                          </div>
                        </div>

                        <h5 className="text-gray-900 text-xs font-bold line-clamp-2 leading-tight mb-1 group-hover:text-[#e30019] transition-colors">
                          {prod.name}
                        </h5>

                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                          <span className="text-[#e30019] font-black text-xs">
                            {formatVND(prod.price)}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleQuickAdd(prod)}
                            style={addedMap[prod.id] ? { backgroundColor: '#059669' } : { backgroundColor: '#e30019' }}
                            className="p-1.5 rounded-lg text-white text-xs font-medium transition-all shadow-sm hover:brightness-110 active:scale-95"
                            title="Thêm nhanh vào giỏ"
                          >
                            {addedMap[prod.id] ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <ShoppingCart className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0 text-white shadow-sm font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Animation */}
        {loading && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 text-[#e30019]">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-white border border-gray-200 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#e30019] animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#e30019]/70 animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#e30019]/40 animate-bounce"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="px-3.5 py-2 border-t border-gray-200 bg-white">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {SUGGESTION_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(chip)}
              disabled={loading}
              className="px-2.5 py-1 bg-gray-100 hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-full text-[11px] text-gray-700 hover:text-[#e30019] font-medium transition-all flex-shrink-0 flex items-center gap-1 disabled:opacity-50"
            >
              <span>{chip}</span>
              <ChevronRight className="w-3 h-3 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-gray-200 flex items-center gap-2"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Hỏi GearVN về chọn máy cho sinh viên, đồ họa, gaming..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-xs md:text-sm placeholder-gray-400 focus:outline-none focus:border-[#e30019] focus:bg-white transition-all disabled:opacity-50"
        />

        <button
          id="send-chat-message-btn"
          type="submit"
          disabled={loading || !input.trim()}
          style={{ backgroundColor: '#e30019' }}
          className="p-2.5 hover:brightness-110 text-white rounded-xl shadow-md active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          title="Gửi câu hỏi"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );

  return (
    <>
      {/* Floating Trigger Button at bottom-right */}
      {!isOpen && (
        <button
          id="open-chat-widget-btn"
          type="button"
          onClick={() => setIsOpen(true)}
          style={{ backgroundColor: '#e30019' }}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 px-4 py-3 hover:brightness-110 text-white rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-black leading-tight tracking-tight">Tư vấn GearVN</p>
            <p className="text-[10px] text-white/90">Hỗ trợ AI trực tuyến 24/7</p>
          </div>
        </button>
      )}

      {/* When Maximized: Centered Modal with Backdrop */}
      {isOpen && isMaximized && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-4xl h-[85vh]">
            {renderChatBox()}
          </div>
        </div>
      )}

      {/* When Minimized: Standard 380px x 540px Docked Box at Bottom-Right */}
      {isOpen && !isMaximized && (
        <div className="fixed bottom-6 right-6 w-[390px] h-[550px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-3rem)] z-50 animate-in slide-in-from-bottom-4 duration-200">
          {renderChatBox()}
        </div>
      )}
    </>
  );
};

export default ChatWidget;
