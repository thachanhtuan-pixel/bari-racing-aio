import React, { useState } from 'react';
import { EngineCalcInput, MotorcycleSpec } from '../../types';
import { evaluateEngineBuild } from '../../utils/engine-calc';
import { MOTORCYCLE_DATABASE } from '../../data/motorcycle-db';
import { RotateCcw } from 'lucide-react';
import { GlowingStarIcon } from '../GlowingStarIcon';

interface EngineCalculatorProps {
  onApplyCarbTab?: () => void;
}

export const EngineCalculator: React.FC<EngineCalculatorProps> = ({ onApplyCarbTab }) => {
  const [inputs, setInputs] = useState<EngineCalcInput>({
    bore: 51.0,
    stroke: 54.0,
    chamberVolume: 12.0,
    gasketThickness: 0.5,
    carbDiameter: 18.0,
    peakRpm: 8500
  });

  const [selectedStockId, setSelectedStockId] = useState<string>('sirius-110-zin');

  const result = evaluateEngineBuild(inputs);

  const handleApplyStock = (spec: MotorcycleSpec) => {
    setSelectedStockId(spec.id);
    const estChamber = Number((spec.displacement / (spec.cr - 1)).toFixed(1));
    setInputs({
      bore: spec.bore,
      stroke: spec.stroke,
      chamberVolume: estChamber > 0 ? estChamber : 12.0,
      gasketThickness: 0.5,
      carbDiameter: spec.carbZin,
      peakRpm: spec.peakHpRpm || 8500
    });
  };

  const handleReset = () => {
    const defaultSpec = MOTORCYCLE_DATABASE[0];
    handleApplyStock(defaultSpec);
  };

  // Quick Bore presets for garage mechanics
  const borePresets = [39, 50, 51, 52.4, 54, 56, 57, 58, 62, 65, 68];
  const strokePresets = [41.4, 49.5, 54.0, 55.6, 57.5, 57.9, 58.7];

  return (
    <div className="space-y-6">
      {/* Quick Stock Selector Bar */}
      <div className="p-4 rounded-2xl bg-black border border-white/20 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GlowingStarIcon size={18} />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Nạp mẫu xe zin hoặc bài độ nhanh:
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          <select
            value={selectedStockId}
            onChange={(e) => {
              const spec = MOTORCYCLE_DATABASE.find(s => s.id === e.target.value);
              if (spec) handleApplyStock(spec);
            }}
            className="bg-neutral-950 text-white text-xs font-mono font-bold px-3 py-2 rounded-xl border border-white/30 focus:border-white outline-none cursor-pointer"
          >
            {MOTORCYCLE_DATABASE.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.bore} x {s.stroke}mm - {s.displacement}cc)
              </option>
            ))}
          </select>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black hover:bg-neutral-900 text-xs font-mono text-white border border-white/30 hover:border-white transition cursor-pointer"
            title="Đặt lại mặc định"
          >
            <RotateCcw className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: TACTILE INPUT CONTROLS */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-black border border-white/20 space-y-5">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <h3 className="text-sm font-mono font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <GlowingStarIcon size={14} />
                THÔNG SỐ PISTON & HÀNH TRÌNH DÊN
              </h3>
              <span className="text-[11px] font-mono text-white/50">Đơn vị: mm / cc</span>
            </div>

            {/* Bore (Đường kính Piston) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <span>1. BORE (Đường Kính Trái Piston)</span>
                  <span className="text-[10px] text-black bg-white px-1.5 py-0.5 rounded font-mono font-bold">
                    mm
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInputs(prev => ({ ...prev, bore: Math.max(30, Number((prev.bore - 0.5).toFixed(1))) }))}
                    className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-sm border border-white/30 active:scale-95"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="100"
                    value={inputs.bore}
                    onChange={(e) => setInputs(prev => ({ ...prev, bore: parseFloat(e.target.value) || 0 }))}
                    className="w-20 text-center text-sm font-mono font-bold bg-neutral-950 border border-white/60 rounded-lg py-1 text-white outline-none"
                  />
                  <button
                    onClick={() => setInputs(prev => ({ ...prev, bore: Math.min(100, Number((prev.bore + 0.5).toFixed(1))) }))}
                    className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-sm border border-white/30 active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="35"
                max="75"
                step="0.5"
                value={inputs.bore}
                onChange={(e) => setInputs(prev => ({ ...prev, bore: parseFloat(e.target.value) }))}
                className="w-full accent-white h-2 bg-neutral-900 rounded-lg cursor-pointer"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {borePresets.map((b) => (
                  <button
                    key={b}
                    onClick={() => setInputs(prev => ({ ...prev, bore: b }))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition cursor-pointer ${
                      inputs.bore === b
                        ? 'bg-white text-black font-black border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                        : 'bg-black text-white/60 border-white/20 hover:text-white hover:border-white/50'
                    }`}
                  >
                    {b}mm
                  </button>
                ))}
              </div>
            </div>

            {/* Stroke (Hành trình dên) */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                  <span>2. STROKE (Hành Trình Dên)</span>
                  <span className="text-[10px] text-black bg-white px-1.5 py-0.5 rounded font-mono font-bold">
                    mm
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInputs(prev => ({ ...prev, stroke: Math.max(30, Number((prev.stroke - 0.5).toFixed(1))) }))}
                    className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-sm border border-white/30 active:scale-95"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="100"
                    value={inputs.stroke}
                    onChange={(e) => setInputs(prev => ({ ...prev, stroke: parseFloat(e.target.value) || 0 }))}
                    className="w-20 text-center text-sm font-mono font-bold bg-neutral-950 border border-white/60 rounded-lg py-1 text-white outline-none"
                  />
                  <button
                    onClick={() => setInputs(prev => ({ ...prev, stroke: Math.min(100, Number((prev.stroke + 0.5).toFixed(1))) }))}
                    className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-mono font-bold text-sm border border-white/30 active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="35"
                max="75"
                step="0.5"
                value={inputs.stroke}
                onChange={(e) => setInputs(prev => ({ ...prev, stroke: parseFloat(e.target.value) }))}
                className="w-full accent-white h-2 bg-neutral-900 rounded-lg cursor-pointer"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {strokePresets.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInputs(prev => ({ ...prev, stroke: s }))}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition cursor-pointer ${
                      inputs.stroke === s
                        ? 'bg-white text-black font-black border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                        : 'bg-black text-white/60 border-white/20 hover:text-white hover:border-white/50'
                    }`}
                  >
                    {s}mm
                  </button>
                ))}
              </div>
            </div>

            {/* Chamber Volume (Buồng Nổ Chảo Đầu) */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono font-bold text-white block mb-1">
                  3. Thể Tích Chảo Đầu Bò (cc)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="4"
                    max="30"
                    value={inputs.chamberVolume}
                    onChange={(e) => setInputs(prev => ({ ...prev, chamberVolume: parseFloat(e.target.value) || 0 }))}
                    className="w-full text-center text-sm font-mono font-bold bg-neutral-950 border border-white/40 focus:border-white rounded-xl py-2 text-white outline-none"
                  />
                  <span className="text-xs font-mono text-white/60">cc</span>
                </div>
                <p className="text-[10px] text-white/50 font-mono mt-1">
                  Đo bằng ống tiêm châm nhớt lỏng vào chảo xúp-páp
                </p>
              </div>

              {/* Gasket thickness (Chêm Ron Chân Lòng / Thớt) */}
              <div>
                <label className="text-xs font-mono font-bold text-white block mb-1">
                  4. Độ Dày Ron Chân Lòng (mm)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.3"
                    max="10"
                    value={inputs.gasketThickness}
                    onChange={(e) => setInputs(prev => ({ ...prev, gasketThickness: parseFloat(e.target.value) || 0 }))}
                    className="w-full text-center text-sm font-mono font-bold bg-neutral-950 border border-white/40 focus:border-white rounded-xl py-2 text-white outline-none"
                  />
                  <span className="text-xs font-mono text-white/60">mm</span>
                </div>
                <p className="text-[10px] text-white/50 font-mono mt-1">
                  Zin ~0.5mm. Chêm thêm hạ nén / tránh đụng mắt súp-bắp
                </p>
              </div>
            </div>

            {/* Carburetor & Peak RPM */}
            <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono font-bold text-white block mb-1">
                  5. Cỡ Bình Xăng Con / Họng Gió
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="1"
                    min="12"
                    max="45"
                    value={inputs.carbDiameter}
                    onChange={(e) => setInputs(prev => ({ ...prev, carbDiameter: parseFloat(e.target.value) || 0 }))}
                    className="w-full text-center text-sm font-mono font-bold bg-neutral-950 border border-white/40 focus:border-white rounded-xl py-2 text-white outline-none"
                  />
                  <span className="text-xs font-mono text-white/60">mm</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-white block mb-1">
                  6. Dải Tua Đỉnh Máy (Peak RPM)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="500"
                    min="5000"
                    max="15000"
                    value={inputs.peakRpm}
                    onChange={(e) => setInputs(prev => ({ ...prev, peakRpm: parseFloat(e.target.value) || 8500 }))}
                    className="w-full text-center text-sm font-mono font-bold bg-neutral-950 border border-white/40 focus:border-white rounded-xl py-2 text-white outline-none"
                  />
                  <span className="text-xs font-mono text-white/60">RPM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: DIGITAL READOUT LCD & RESULTS */}
        <div className="lg:col-span-5 space-y-4">
          {/* DIGITAL LCD READOUT - PURE MONOCHROME */}
          <div className="lcd-display rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center text-xs opacity-75 border-b border-white/30 pb-2 mb-3">
              <span className="flex items-center gap-1.5">
                <GlowingStarIcon size={12} />
                BARI DIGITAL LCD READOUT
              </span>
              <span>CALC METRIC 60FPS</span>
            </div>

            {/* Displacement CC */}
            <div className="mb-4">
              <span className="text-xs opacity-70 block font-mono">DUNG TÍCH XI-LANH THỰC TẾ:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black font-tech tracking-tighter text-white white-glow-text">
                  {result.displacement}
                </span>
                <span className="text-xl font-bold opacity-90">cc</span>
              </div>
              <p className="text-[11px] opacity-70 font-mono mt-1">
                Công thức: π × ({inputs.bore}/2)² × {inputs.stroke} ÷ 1000
              </p>
            </div>

            {/* Geometric CR */}
            <div className="pt-3 border-t border-white/30">
              <span className="text-xs opacity-70 block font-mono">TỈ SỐ NÉN HÌNH HỌC (CR):</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-tech text-white white-glow-text">
                  {result.geometricCR}
                </span>
                <span className="text-xl font-bold opacity-90">: 1</span>
              </div>
              <p className="text-[11px] opacity-70 font-mono mt-0.5">
                CR = (V_xilanh + V_buồng_nổ) ÷ V_buồng_nổ
              </p>
            </div>

            {/* Bore/Stroke Ratio & Engine Type */}
            <div className="mt-3 pt-3 border-t border-white/30 flex justify-between text-xs font-mono">
              <div>
                <span className="opacity-70">Tỉ lệ B/S: </span>
                <strong className="text-white">{(inputs.bore / inputs.stroke).toFixed(2)}</strong>
              </div>
              <div>
                <span className="opacity-70">Kiểu máy: </span>
                <strong className="text-white">
                  {inputs.bore > inputs.stroke ? 'Short-Stroke' : inputs.bore === inputs.stroke ? 'Square' : 'Long-Stroke'}
                </strong>
              </div>
            </div>
          </div>

          {/* FUEL & OCTANE ADVICE CARD - BLACK & WHITE */}
          <div className="p-4 rounded-2xl border border-white/40 bg-black text-white shadow-[0_0_15px_rgba(255,255,255,0.15)]">
            <div className="flex items-center gap-2 mb-1.5">
              <GlowingStarIcon size={16} />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                Khuyến Nghị Nhiên Liệu & Octane:
              </h4>
            </div>
            <p className="text-xs leading-relaxed font-mono text-white/90">
              {result.fuelRecommendation}
            </p>
          </div>

          {/* QUICK AIRFLOW SYNC BANNER */}
          <div className="p-4 rounded-2xl bg-black border border-white/20 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-white/60">Cỡ bình xăng chuẩn khuyến nghị:</span>
              <strong className="text-white text-sm border-b border-white pb-0.5">{result.recommendedCarbSize} mm</strong>
            </div>
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-white/60">Bình xăng bạn đang gắn:</span>
              <strong className="text-white text-sm">{inputs.carbDiameter} mm</strong>
            </div>

            <div className="pt-2 border-t border-white/15">
              <span className="text-[11px] font-mono font-bold block text-white">
                Hiệu ứng: {result.carbEffects.lowEnd}
              </span>
              <p className="text-[11px] text-white/70 font-mono mt-0.5">
                {result.carbEffects.highEnd} • Tiêu hao nhiên liệu: ~{result.carbEffects.fuelEstLitersPer100km} L/100km
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
