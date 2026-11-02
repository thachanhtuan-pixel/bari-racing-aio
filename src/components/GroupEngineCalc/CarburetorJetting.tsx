import React, { useState } from 'react';
import { calculateCarbAirflow } from '../../utils/engine-calc';
import { GlowingStarIcon } from '../GlowingStarIcon';

export const CarburetorJetting: React.FC = () => {
  const [displacement, setDisplacement] = useState<number>(110);
  const [peakRpm, setPeakRpm] = useState<number>(8500);
  const [carbSize, setCarbSize] = useState<number>(28); // e.g. Uma 28 on 110cc

  const result = calculateCarbAirflow(displacement, peakRpm, carbSize);

  // Common Carburetor Presets in Vietnamese custom scene
  const carbPresets = [
    { name: 'Keihin Zin 110', size: 17, brand: 'Keihin PB' },
    { name: 'Centa 125 / 150', size: 20, brand: 'Thành Đạt Centa' },
    { name: 'Bông Mai Vàng (PE28)', size: 28, brand: 'Keihin PE' },
    { name: 'PWK Ga Dẹp 28', size: 28, brand: 'Uma / Sudco PWK' },
    { name: 'PWK 30 / 32', size: 30, brand: 'Koso / Uma' },
    { name: 'Họng Xăng Fi 32/34', size: 32, brand: 'BRT / SCK' }
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-black border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/15 pb-3 mb-4">
          <div>
            <h3 className="text-base font-mono font-bold text-white uppercase flex items-center gap-2">
              <GlowingStarIcon size={18} />
              TÍNH TOÁN HỌNG GIÓ & BÌNH XĂNG CON (VENTURI AIRFLOW)
            </h3>
            <p className="text-xs text-white/60 font-mono mt-0.5">
              Phân tích động học luồng khí nạp, hiện tượng hụp ga đầu (bogging) và độ rướn nước hậu
            </p>
          </div>
          <div className="text-xs font-mono text-white bg-black border border-white/40 px-2.5 py-1 rounded-lg">
            ISO Small Engine Venturi Math
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-xs font-mono font-bold text-white block mb-1">
              Dung tích động cơ (cc)
            </label>
            <input
              type="number"
              step="1"
              value={displacement}
              onChange={(e) => setDisplacement(parseFloat(e.target.value) || 0)}
              className="w-full text-center text-sm font-mono font-bold bg-neutral-950 border border-white/40 focus:border-white rounded-xl py-2 text-white outline-none"
            />
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {[50, 110, 125, 135, 150, 175].map(cc => (
                <button
                  key={cc}
                  onClick={() => setDisplacement(cc)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded border transition cursor-pointer ${
                    displacement === cc ? 'bg-white text-black font-bold border-white' : 'bg-black text-white/60 border-white/20'
                  }`}
                >
                  {cc}cc
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-white block mb-1">
              Tua máy cực đại (RPM)
            </label>
            <input
              type="number"
              step="500"
              value={peakRpm}
              onChange={(e) => setPeakRpm(parseFloat(e.target.value) || 8000)}
              className="w-full text-center text-sm font-mono font-bold bg-neutral-950 border border-white/40 focus:border-white rounded-xl py-2 text-white outline-none"
            />
            <p className="text-[10px] text-white/50 font-mono mt-1">
              Tua đạt công suất đỉnh của bài máy
            </p>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-white block mb-1">
              Cỡ họng bình xăng gắn xe (mm)
            </label>
            <input
              type="number"
              step="0.5"
              value={carbSize}
              onChange={(e) => setCarbSize(parseFloat(e.target.value) || 0)}
              className="w-full text-center text-sm font-mono font-bold bg-neutral-950 border border-white/40 focus:border-white rounded-xl py-2 text-white outline-none"
            />
            <div className="text-[10px] text-white/50 font-mono mt-1">
              Đường kính họng gió Venturi (D)
            </div>
          </div>
        </div>

        {/* Quick Carb Presets */}
        <div className="mb-6">
          <label className="text-xs font-mono font-bold text-white/70 uppercase block mb-2">
            Mẫu bình xăng & họng ga thông dụng thị trường:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {carbPresets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setCarbSize(p.size)}
                className={`p-2.5 rounded-xl border text-left transition cursor-pointer ${
                  carbSize === p.size
                    ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                    : 'bg-black border-white/20 text-white/70 hover:border-white/50'
                }`}
              >
                <div className={`text-xs font-bold font-mono ${carbSize === p.size ? 'text-black' : 'text-white'}`}>{p.name}</div>
                <div className={`text-[10px] font-mono ${carbSize === p.size ? 'text-black/80 font-bold' : 'text-white/60'}`}>{p.size}mm • {p.brand}</div>
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS & DELTA COMPARISON - MONOCHROME */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/15">
          <div className="p-4 rounded-xl bg-neutral-950 border border-white/25">
            <span className="text-[11px] font-mono text-white/60 block">CỠ HỌNG KHUYẾN NGHỊ:</span>
            <div className="text-3xl font-black font-tech text-white white-glow-text mt-1">
              {result.recommendedCarbSize} <span className="text-lg">mm</span>
            </div>
            <p className="text-[11px] text-white/50 font-mono mt-1">
              Công thức: D = 0.65 × √(cc × RPM ÷ 1000)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-white/25">
            <span className="text-[11px] font-mono text-white/60 block">ĐỘ LỆCH SO VỚI TỐI ƯU:</span>
            <div className="text-3xl font-black font-tech text-white mt-1">
              {carbSize - result.recommendedCarbSize > 0 ? `+${(carbSize - result.recommendedCarbSize).toFixed(1)}` : (carbSize - result.recommendedCarbSize).toFixed(1)} <span className="text-lg">mm</span>
            </div>
            <p className="text-[11px] text-white/50 font-mono mt-1">
              Lệch: {Math.round(result.carbDeltaRatio * 100)}% so với tiêu chuẩn
            </p>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-white/25">
            <span className="text-[11px] font-mono text-white/60 block">MỨC ĂN XĂNG ƯỚC TÍNH:</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black font-tech text-white">
                {result.fuelEstLitersPer100km}
              </span>
              <span className="text-sm font-mono text-white/70">Lít / 100km</span>
            </div>
            <p className="text-[11px] text-white/70 font-mono mt-1">
              {result.fuelBurnRateDelta !== 0 ? `Biến động: ${result.fuelBurnRateDelta > 0 ? `+${result.fuelBurnRateDelta}%` : `${result.fuelBurnRateDelta}%`} mức tiêu hao` : 'Mức ăn xăng chuẩn'}
            </p>
          </div>
        </div>

        {/* SPECIFIC BOGGING & TOP-END WARNING FLAGS - PURE BLACK & WHITE */}
        <div className="mt-5 space-y-3">
          {result.statusBadge === 'bogging' && (
            <div className="p-4 rounded-xl bg-black border-2 border-white text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <div className="flex items-center gap-2 mb-1.5">
                <GlowingStarIcon size={18} />
                <h4 className="text-sm font-mono font-black uppercase text-white">
                  CẢNH BÁO: HỤP GA ĐẦU NẶNG (SEVERE LOW-END BOGGING)
                </h4>
              </div>
              <p className="text-xs leading-relaxed font-mono text-white/90">
                Bạn đang gắn bình <strong>{carbSize}mm</strong> vượt quá nhiều so với mức tối ưu <strong>{result.recommendedCarbSize}mm</strong> cho động cơ {displacement}cc. 
                Vận tốc dòng khí nạp ở vòng tua thấp bị tụt đột ngột làm loãng hòa khí:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2 border-t border-white/20 text-xs font-mono">
                <div className="flex items-center gap-2 text-white">
                  <GlowingStarIcon size={12} />
                  <span><strong>{result.lowEndDelta}% Gia tốc nước đề:</strong> Xe bị ngộp xăng/ngộp gió khi thốc ga gấp.</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <GlowingStarIcon size={12} />
                  <span><strong>+{result.highEndDelta}% Nước hậu:</strong> Khi đạt tua cao, họng lớn giúp xe thông thoáng rướn sâu.</span>
                </div>
              </div>
              <p className="text-[11px] text-white/80 font-mono mt-2 bg-neutral-900 p-2.5 rounded-lg border border-white/20">
                💡 <strong>Mẹo khắc phục cho thợ:</strong> Tăng gíc-lơ phụ (Slow jet) lên 1-2 số, thay kim xăng hình nón nhọn hơn, hoặc dùng loa kèn (velocity stack) thu hẹp luồng xoáy gió.
              </p>
            </div>
          )}

          {result.statusBadge === 'choked' && (
            <div className="p-4 rounded-xl bg-black border border-white/60 text-white">
              <div className="flex items-center gap-2 mb-1">
                <GlowingStarIcon size={16} />
                <h4 className="text-sm font-mono font-bold uppercase text-white">
                  CẢNH BÁO: BÍ NƯỚC HẬU (TOP-END CHOKED)
                </h4>
              </div>
              <p className="text-xs leading-relaxed font-mono text-white/80">
                Cỡ bình {carbSize}mm quá nhỏ so với dung tích {displacement}cc ở dải tua {peakRpm} RPM. Xe sẽ rất lanh ga đầu (+10%), nhưng nước hậu sẽ bị ghì máy, không thể phát hết công suất ({result.highEndDelta}%).
              </p>
            </div>
          )}

          {result.statusBadge === 'optimal' && (
            <div className="p-4 rounded-xl bg-black border-2 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.25)]">
              <div className="flex items-center gap-2 mb-1">
                <GlowingStarIcon size={16} />
                <h4 className="text-sm font-mono font-bold uppercase text-white">
                  CÂN BẰNG KHÍ ĐỘNG HỌC HOÀN HẢO (OPTIMAL FLOW)
                </h4>
              </div>
              <p className="text-xs leading-relaxed font-mono text-white/90">
                Cỡ bình {carbSize}mm tương thích lý tưởng với động cơ {displacement}cc. Vận tốc Venturi đạt chuẩn Bernoulli, nước đề nhạy lanh ga và nước hậu ngọt ngào, tiết kiệm nhiên liệu tối đa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
