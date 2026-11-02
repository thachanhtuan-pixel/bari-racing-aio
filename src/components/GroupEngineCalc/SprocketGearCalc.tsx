import React, { useState } from 'react';
import { calculateSprocketRatio } from '../../utils/engine-calc';
import { GlowingStarIcon } from '../GlowingStarIcon';

export const SprocketGearCalc: React.FC = () => {
  const [frontSprocket, setFrontSprocket] = useState<number>(14);
  const [rearSprocket, setRearSprocket] = useState<number>(36);
  const [rpmRedline, setRpmRedline] = useState<number>(9000);
  const [tireSize, setTireSize] = useState<string>('70/90-17');

  const { ratio, characteristic } = calculateSprocketRatio(frontSprocket, rearSprocket);

  const popularCombos = [
    { label: 'Wave Zin 14-36', f: 14, r: 36 },
    { label: 'Sirius Zin 15-35', f: 15, r: 35 },
    { label: 'Sirius Đề Bốc 14-35', f: 14, r: 35 },
    { label: 'Ex 135 Zin 14-38', f: 14, r: 38 },
    { label: 'Ex 150 Zin 14-42', f: 14, r: 42 },
    { label: 'Winner 150 Zin 15-44', f: 15, r: 44 },
    { label: 'Wave 54zz Hậu 15-34', f: 15, r: 34 },
    { label: 'Touring Đường Dài 15-33', f: 15, r: 33 }
  ];

  const tireCircumference = tireSize === '60/90-17' ? 1.77 : tireSize === '80/90-17' ? 1.88 : 1.83;
  const gearRatios = [
    { gear: 1, ratio: 2.833 },
    { gear: 2, ratio: 1.705 },
    { gear: 3, ratio: 1.238 },
    { gear: 4, ratio: 0.958 }
  ];
  const primaryReduction = 3.722;

  const calculateGearSpeed = (internalRatio: number) => {
    const totalReduction = primaryReduction * internalRatio * ratio;
    const speedKmh = (rpmRedline * tireCircumference * 60) / (totalReduction * 1000);
    return Math.round(speedKmh);
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-black border border-white/20">
        <div className="flex justify-between items-center border-b border-white/15 pb-3 mb-4">
          <div>
            <h3 className="text-base font-mono font-bold text-white uppercase flex items-center gap-2">
              <GlowingStarIcon size={18} />
              TÍNH TOÁN TỈ SỐ TRUYỀN NHÔNG SÊN DĨA (NSD)
            </h3>
            <p className="text-xs text-white/60 font-mono mt-0.5">
              Cân bằng lực kéo nước đề và tốc độ nước hậu đường dài
            </p>
          </div>
          <span className="text-xs font-mono text-white bg-black border border-white/40 px-2.5 py-1 rounded-lg">
            Sprocket Ratio Matrix
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-5">
          <div>
            <label className="text-xs font-mono font-bold text-white block mb-1">
              Nhông Trước (Số răng)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="12"
                max="18"
                value={frontSprocket}
                onChange={(e) => setFrontSprocket(parseInt(e.target.value) || 14)}
                className="w-full text-center text-lg font-mono font-bold bg-neutral-950 border border-white/50 rounded-xl py-2 text-white outline-none"
              />
              <span className="text-xs font-mono text-white/60">T</span>
            </div>
            <div className="flex gap-1 mt-1.5 justify-center">
              {[13, 14, 15, 16].map(t => (
                <button
                  key={t}
                  onClick={() => setFrontSprocket(t)}
                  className={`px-2 py-0.5 text-xs font-mono rounded border transition cursor-pointer ${
                    frontSprocket === t ? 'bg-white text-black font-bold border-white' : 'bg-black text-white/60 border-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-white block mb-1">
              Dĩa Sau (Số răng)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="28"
                max="50"
                value={rearSprocket}
                onChange={(e) => setRearSprocket(parseInt(e.target.value) || 36)}
                className="w-full text-center text-lg font-mono font-bold bg-neutral-950 border border-white/50 rounded-xl py-2 text-white outline-none"
              />
              <span className="text-xs font-mono text-white/60">T</span>
            </div>
            <div className="flex gap-1 mt-1.5 justify-center flex-wrap">
              {[33, 34, 35, 36, 38, 42].map(t => (
                <button
                  key={t}
                  onClick={() => setRearSprocket(t)}
                  className={`px-2 py-0.5 text-xs font-mono rounded border transition cursor-pointer ${
                    rearSprocket === t ? 'bg-white text-black font-bold border-white' : 'bg-black text-white/60 border-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-white block mb-1">
              Tua Hết Ga (Redline RPM)
            </label>
            <input
              type="number"
              step="500"
              value={rpmRedline}
              onChange={(e) => setRpmRedline(parseInt(e.target.value) || 9000)}
              className="w-full text-center text-sm font-mono font-bold bg-neutral-950 border border-white/30 rounded-xl py-2 text-white outline-none"
            />
            <p className="text-[10px] text-white/50 font-mono mt-1">
              Vòng tua giới hạn cắt IC
            </p>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-white block mb-1">
              Kích Thước Vỏ Xe Sau
            </label>
            <select
              value={tireSize}
              onChange={(e) => setTireSize(e.target.value)}
              className="w-full bg-neutral-950 border border-white/30 rounded-xl py-2 px-2 text-xs font-mono font-bold text-white outline-none cursor-pointer"
            >
              <option value="60/90-17">60/90-17 (Vỏ nhỏ Drag)</option>
              <option value="70/90-17">70/90-17 (Chuẩn Wave/Sirius)</option>
              <option value="80/90-17">80/90-17 (Vỏ lớn Touring)</option>
            </select>
          </div>
        </div>

        {/* Quick Combos */}
        <div className="mb-6">
          <label className="text-xs font-mono font-bold text-white/70 block mb-1.5">
            Cấu hình NSD thị trường phổ biến:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {popularCombos.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  setFrontSprocket(c.f);
                  setRearSprocket(c.r);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-mono border transition cursor-pointer ${
                  frontSprocket === c.f && rearSprocket === c.r
                    ? 'bg-white text-black font-bold border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                    : 'bg-neutral-950 text-white/60 border-white/20 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Readout Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/15">
          <div className="p-4 rounded-xl bg-black border border-white/40">
            <span className="text-xs font-mono text-white/60 block">TỈ SỐ TRUYỀN CUỐI (FINAL DRIVE RATIO):</span>
            <div className="text-4xl font-black font-tech text-white white-glow-text mt-1">
              {ratio} <span className="text-base text-white/70">: 1</span>
            </div>
            <p className="text-xs font-mono text-white mt-2">
              {characteristic}
            </p>
          </div>

          {/* Speed per gear table */}
          <div className="p-4 rounded-xl bg-black border border-white/20">
            <span className="text-xs font-mono text-white/60 block mb-2">TỐC ĐỘ LÝ THUYẾT TỪNG SỐ (@ {rpmRedline} RPM):</span>
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              {gearRatios.map(g => (
                <div key={g.gear} className="bg-neutral-950 p-2 rounded-lg border border-white/20">
                  <span className="text-[10px] text-white/50 block">Số {g.gear}</span>
                  <span className="text-base font-bold text-white block mt-0.5">
                    {calculateGearSpeed(g.ratio)}
                  </span>
                  <span className="text-[9px] text-white/70">km/h</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/50 font-mono mt-2">
              *Tốc độ thực tế có thể giảm 5-8% do lực cản gió và ma sát mặt đường.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
