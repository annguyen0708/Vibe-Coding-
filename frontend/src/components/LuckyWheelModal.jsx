import { useState } from 'react';
import { X, Gift, Sparkles, Copy, Check, Trophy, RotateCcw, ExternalLink } from 'lucide-react';

const PRIZES = [
  {
    id: 1,
    name: 'Voucher 500.000đ',
    shortName: '500K',
    icon: '🎟️',
    code: 'GEARVN500K',
    color: '#e30019',
    textColor: '#ffffff',
    value: '500.000 đ',
    isVoucher: true,
    description: 'Giảm trực tiếp 500.000đ cho đơn hàng từ 5 triệu tại GearVN',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: 'Chuột Gaming ASUS ROG Keris',
    shortName: 'Chuột ROG',
    icon: '🖱️',
    code: 'GIFTROG',
    color: '#1f1f1f',
    textColor: '#facc15',
    value: '1.290.000 đ',
    isVoucher: false,
    description: 'Chuột Gaming siêu nhẹ 54g cảm biến ROG AimPoint 36.000 DPI',
    image: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: 'Voucher 1.000.000đ',
    shortName: '1 Triệu',
    icon: '💎',
    code: 'GEARVN1TR',
    color: '#b91c1c',
    textColor: '#ffffff',
    value: '1.000.000 đ',
    isVoucher: true,
    description: 'Giảm ngay 1 triệu đồng khi mua Laptop & Màn hình cao cấp',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    name: 'FreeShip Hỏa Tốc Toàn Quốc',
    shortName: 'FreeShip',
    icon: '🚀',
    code: 'FREESHIP',
    color: '#059669',
    textColor: '#ffffff',
    value: '150.000 đ',
    isVoucher: false,
    description: 'Miễn phí giao hàng hỏa tốc trong 2 giờ nội thành & toàn quốc',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    name: 'Balo Gaming ROG Ranger',
    shortName: 'Balo ROG',
    icon: '🎒',
    code: 'GIFTRAZER',
    color: '#18181b',
    textColor: '#38bdf8',
    value: '890.000 đ',
    isVoucher: false,
    description: 'Balo gaming chống nước, đựng laptop 16 inch cực êm ái',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 6,
    name: 'Bàn Di Chuột GVN Size XL',
    shortName: 'Lót Chuột XL',
    icon: '⚡',
    code: 'GIFTPAD',
    color: '#d97706',
    textColor: '#ffffff',
    value: '250.000 đ',
    isVoucher: false,
    description: 'Pad chuột speed 900x400x4mm bo viền RGB cao cấp',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 7,
    name: 'Voucher Giảm 200.000đ',
    shortName: '200K',
    icon: '🎁',
    code: 'GEARVN200K',
    color: '#4338ca',
    textColor: '#ffffff',
    value: '200.000 đ',
    isVoucher: true,
    description: 'Giảm 200.000đ cho mọi đơn hàng phụ kiện & Gaming gear',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 8,
    name: 'Cáp Sạc Nhanh Type-C 100W',
    shortName: 'Cáp 100W',
    icon: '🔌',
    code: 'GIFTCABLE',
    color: '#0f172a',
    textColor: '#a3e635',
    value: '190.000 đ',
    isVoucher: false,
    description: 'Cáp dù chống đứt bọc kim loại, hỗ trợ sạc nhanh PD 100W',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80'
  },
];

export default function LuckyWheelModal({ isOpen, onClose }) {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning) return;

    setSpinning(true);
    setWonPrize(null);

    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const sliceAngle = 360 / PRIZES.length;
    const extraRounds = 360 * 6;
    const prizeCenter = prizeIndex * sliceAngle + sliceAngle / 2;
    // Arrow is at the top (angle 270)
    const targetAngle = rotation + extraRounds + (360 - (rotation % 360)) + (270 - prizeCenter);

    setRotation(targetAngle);

    setTimeout(() => {
      setSpinning(false);
      setHasSpun(true);
      setWonPrize(PRIZES[prizeIndex]);
    }, 4500);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetSpin = () => {
    setWonPrize(null);
    setHasSpun(false);
  };

  const sliceAngle = 360 / PRIZES.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#1a1a1a] via-[#121212] to-black border-2 border-red-600/40 rounded-3xl p-5 sm:p-7 shadow-2xl text-white text-center overflow-hidden my-auto">
        
        {/* Glow ambient */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="mb-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
            Minigame Tri Ân Khách Hàng GEARVN
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            VÒNG QUAY <span className="text-[#e30019]">MAY MẮN</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            100% trúng quà: Voucher đến 1.000.000đ & Quà tặng Gaming Gear chính hãng!
          </p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 sm:w-76 sm:h-76 mx-auto my-3 flex items-center justify-center">
          
          {/* Wheel Pointer Indicator */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-3.5 z-30 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-yellow-400 drop-shadow-[0_4px_10px_rgba(250,204,21,0.8)]" />
            <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full -mt-1 shadow-md border-2 border-black" />
          </div>

          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-yellow-400/90 shadow-[0_0_35px_rgba(227,0,25,0.5)] pointer-events-none" />

          {/* Wheel SVG */}
          <div
            className="w-full h-full rounded-full overflow-hidden shadow-2xl transition-transform duration-[4500ms] cubic-bezier(0.12, 0.9, 0.18, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {PRIZES.map((prize, idx) => {
                const startAngle = (idx * sliceAngle) * (Math.PI / 180);
                const endAngle = ((idx + 1) * sliceAngle) * (Math.PI / 180);
                const x1 = 50 + 50 * Math.cos(startAngle);
                const y1 = 50 + 50 * Math.sin(startAngle);
                const x2 = 50 + 50 * Math.cos(endAngle);
                const y2 = 50 + 50 * Math.sin(endAngle);
                const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                const midAngle = ((idx + 0.5) * sliceAngle);
                const isBottom = midAngle > 90 && midAngle < 270;

                return (
                  <g key={prize.id}>
                    <path
                      d={pathData}
                      fill={prize.color}
                      stroke="#0a0a0a"
                      strokeWidth="0.8"
                    />
                    {/* Radially oriented text & icon - auto flipped so never upside down */}
                    <g transform={`rotate(${midAngle} 50 50)`}>
                      {isBottom ? (
                        <g transform="rotate(180 74 50)">
                          <text
                            x="64"
                            y="50"
                            fontSize="5"
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            {prize.icon}
                          </text>
                          <text
                            x="79"
                            y="50"
                            fill={prize.textColor}
                            fontSize="3.4"
                            fontWeight="900"
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {prize.shortName}
                          </text>
                        </g>
                      ) : (
                        <>
                          <text
                            x="83"
                            y="50"
                            fontSize="5"
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            {prize.icon}
                          </text>
                          <text
                            x="67"
                            y="50"
                            fill={prize.textColor}
                            fontSize="3.4"
                            fontWeight="900"
                            textAnchor="middle"
                            dominantBaseline="central"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                          >
                            {prize.shortName}
                          </text>
                        </>
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub Button */}
          <button
            onClick={handleSpin}
            disabled={spinning}
            className={`absolute z-20 w-14 h-14 rounded-full flex flex-col items-center justify-center font-black text-[11px] uppercase shadow-2xl transition-all cursor-pointer border-2 border-yellow-300 ${
              spinning
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-tr from-[#e30019] to-red-500 text-white hover:scale-105 active:scale-95 hover:shadow-[0_0_25px_rgba(227,0,25,0.9)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 mb-0.5 animate-pulse" />
            <span>{spinning ? 'QUAY...' : 'QUAY'}</span>
          </button>
        </div>

        {/* Won Prize Display With High-Quality Image */}
        {wonPrize && (
          <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-red-950/90 via-black to-yellow-950/90 border-2 border-yellow-500/60 shadow-xl animate-in zoom-in-95 duration-300 text-left">
            <div className="flex items-center gap-2 text-yellow-400 font-black text-xs uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4 text-yellow-400 animate-bounce" />
              <span>Chúc mừng bạn đã trúng quà thực tế!</span>
            </div>

            {/* Prize Product Showcase with Image */}
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
              {/* Actual Image / VIP Voucher Card */}
              {wonPrize.isVoucher ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-to-br from-[#e30019] via-[#b91c1c] to-[#111111] p-2 flex flex-col justify-between border-2 border-yellow-400/90 shadow-lg relative overflow-hidden flex-shrink-0">
                  <div className="flex items-center justify-between text-[8px] font-black text-yellow-300 uppercase tracking-tight">
                    <span>GEARVN</span>
                    <span>VOUCHER</span>
                  </div>
                  <div className="text-center my-auto">
                    <div className="text-base sm:text-lg font-black text-yellow-300 leading-none drop-shadow-sm">
                      {wonPrize.shortName}
                    </div>
                    <div className="text-[9px] text-white font-bold mt-0.5">
                      {wonPrize.value}
                    </div>
                  </div>
                  <div className="bg-black/50 rounded px-1 py-0.5 text-[8px] font-mono text-center text-yellow-300 border border-yellow-400/30">
                    {wonPrize.code}
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-900 border border-yellow-400/40 flex-shrink-0 relative group">
                  <img
                    src={wonPrize.image}
                    alt={wonPrize.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{ display: 'none' }} className="w-full h-full bg-gradient-to-br from-[#e30019] to-black items-center justify-center flex-col text-center p-1">
                    <span className="text-2xl">{wonPrize.icon}</span>
                    <span className="text-[9px] font-bold text-yellow-300 mt-0.5">{wonPrize.shortName}</span>
                  </div>
                  <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] font-bold text-yellow-300 text-center py-0.5">
                    {wonPrize.value}
                  </span>
                </div>
              )}

              {/* Details */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-md inline-block mb-1">
                  {wonPrize.shortName}
                </span>
                <h4 className="font-black text-white text-sm sm:text-base leading-snug line-clamp-1">
                  {wonPrize.name}
                </h4>
                <p className="text-[11px] text-gray-300 mt-1 line-clamp-2 leading-relaxed">
                  {wonPrize.description}
                </p>
              </div>
            </div>

            {/* Voucher Code Box */}
            <div className="mt-3 flex items-center justify-between gap-2 bg-black/80 px-3.5 py-2.5 rounded-xl border border-white/15">
              <div>
                <span className="text-[10px] text-gray-400 block">Mã ưu đãi của bạn:</span>
                <span className="font-mono font-black text-yellow-400 text-sm tracking-wider">
                  {wonPrize.code}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyCode(wonPrize.code)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e30019] hover:brightness-110 text-white font-bold text-xs transition-all cursor-pointer shadow-md"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                </button>

                <button
                  onClick={resetSpin}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  title="Quay tiếp thử lại"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-2">
              💡 Hãy dán mã này vào mục <span className="text-yellow-400 font-bold">Voucher</span> tại trang Giỏ Hàng khi thanh toán để được giảm ngay!
            </p>
          </div>
        )}

        {!wonPrize && (
          <div className="mt-2 text-xs text-gray-400 flex items-center justify-center gap-1.5">
            <Gift className="w-4 h-4 text-[#e30019]" />
            <span>Mỗi khách hàng nhận lượt quay may mắn 100% trúng quà mỗi ngày!</span>
          </div>
        )}
      </div>
    </div>
  );
}
