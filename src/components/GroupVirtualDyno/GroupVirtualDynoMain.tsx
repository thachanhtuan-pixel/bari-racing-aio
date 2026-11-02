import React, { useState } from 'react';
import { VirtualDynoCanvas } from './VirtualDynoCanvas';
import { DynoSheetModal } from './DynoSheetModal';
import { TuningConfig, generateDynoCurve } from '../../utils/virtual-dyno';
import { FileText, ToggleLeft, ToggleRight, Sliders } from 'lucide-react';
import { GlowingStarIcon } from '../GlowingStarIcon';

interface GroupVirtualDynoMainProps {
  onBackToMenu: () => void;
}

export const GroupVirtualDynoMain: React.FC<GroupVirtualDynoMainProps> = ({ onBackToMenu }) => {
  const [showStockComparison, setShowStockComparison] = useState<boolean>(true);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  const [tuningConfig, setTuningConfig] = useState<TuningConfig>({
    name: 'Sirius 54zz Cam Xăng Nồi',
    camType: 'mild_5.5mm',
    exhaustType: 'free_flow_titan',
    ecuMapping: 'reflash_pxl',
    displacementCc: 124,
    cr: 11.2,
    carbDiameterMm: 24
  });

  const stockConfig: TuningConfig = {
    name: 'Xe Zin Tiêu Chuẩn 110cc',
    camType: 'stock',
    exhaustType: 'stock',
    ecuMapping: 'stock',
    displacementCc: 110,
    cr: 9.3,
    carbDiameterMm: 17
  };

  const currentDyno = generateDynoCurve(tuningConfig);
  const stockDyno = generateDynoCurve(stockConfig);

  const presets: { label: string; config: TuningConfig }[] = [
    {
      label: '110cc Zin Học Sinh',
      config: {
        name: 'Sirius / Wave 110cc Zin',
        camType: 'stock',
        exhaustType: 'stock',
        ecuMapping: 'stock',
        displacementCc: 110,
        cr: 9.3,
        carbDiameterMm: 17
      }
    },
    {
      label: '110cc PXL (Pô Xăng Lửa)',
      config: {
        name: '110cc Bài Pô Xăng Lửa (PXL)',
        camType: 'stock',
        exhaustType: 'slip_on',
        ecuMapping: 'reflash_pxl',
        displacementCc: 110,
        cr: 9.8,
        carbDiameterMm: 20
      }
    },
    {
      label: '54zz Cam Xăng Nồi (CXN)',
      config: {
        name: 'Bài 54zz Trái 54 Dên Zin',
        camType: 'mild_5.5mm',
        exhaustType: 'free_flow_titan',
        ecuMapping: 'reflash_pxl',
        displacementCc: 124,
        cr: 11.2,
        carbDiameterMm: 24
      }
    },
    {
      label: '54 Dên Đôn Chạy Trường',
      config: {
        name: 'Wave 54 Dên Đôn Tay Ngắn',
        camType: 'racing_6.2mm',
        exhaustType: 'racing_megaphone',
        ecuMapping: 'stand_alone_race',
        displacementCc: 132,
        cr: 12.2,
        carbDiameterMm: 28
      }
    },
    {
      label: 'Ex 62zz Touring Bạo Lực',
      config: {
        name: 'Exciter 62zz Lòng Kiếng',
        camType: 'touring_cnc',
        exhaustType: 'free_flow_titan',
        ecuMapping: 'stand_alone_race',
        displacementCc: 177,
        cr: 12.0,
        carbDiameterMm: 34
      }
    }
  ];

  const hpDelta = Number((currentDyno.peakHp - stockDyno.peakHp).toFixed(1));
  const tqDelta = Number((currentDyno.maxTorque - stockDyno.maxTorque).toFixed(1));

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* Top Bar with Presets & Certificate Action */}
      <div className="p-4 rounded-2xl bg-black border border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GlowingStarIcon size={18} />
            <h3 className="text-base font-mono font-bold text-white uppercase">
              VIRTUAL DYNO LITE PROJECTIONS
            </h3>
          </div>
          <p className="text-xs text-white/60 font-mono mt-0.5">
            Mô phỏng đường đặc tính công suất và momen xoắn dải tua 2000 - 12000 RPM (Black & White)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Stock comparison toggle */}
          <button
            onClick={() => setShowStockComparison(!showStockComparison)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black border border-white/30 hover:border-white text-xs font-mono text-white cursor-pointer"
          >
            {showStockComparison ? (
              <ToggleRight className="w-4 h-4 text-white" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-white/40" />
            )}
            <span>So sánh xe Zin</span>
          </button>

          {/* Export Dyno Sheet */}
          <button
            onClick={() => setShowCertificateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-black font-mono font-black text-xs hover:bg-neutral-200 transition shadow-[0_0_15px_rgba(255,255,255,0.4)] cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-black" />
            <span>XUẤT PHIẾU DYNO</span>
          </button>
        </div>
      </div>

      {/* Quick Presets Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-mono text-white/60 uppercase shrink-0">Gói Bài Độ:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => setTuningConfig(p.config)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition border cursor-pointer ${
              tuningConfig.name === p.config.name
                ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                : 'bg-black text-white/60 border-white/20 hover:text-white'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* DYNO CANVAS RENDERING */}
      <VirtualDynoCanvas
        dynoResult={currentDyno}
        stockResult={stockDyno}
        showStockComparison={showStockComparison}
      />

      {/* METRIC CARDS READOUT - MONOCHROME */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-black border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <span className="text-[10px] font-mono text-white/50 block">CÔNG SUẤT CỰC ĐẠI</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-black font-tech text-white white-glow-text">
              {currentDyno.peakHp}
            </span>
            <span className="text-sm font-bold text-white/80">HP</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono mt-1 text-white/70">
            <span>@{currentDyno.peakHpRpm} RPM</span>
            {hpDelta > 0 && <span className="text-white font-bold">+{hpDelta} HP</span>}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black border border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          <span className="text-[10px] font-mono text-white/50 block">MOMEN XOẮN CỰC ĐẠI</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-black font-tech text-white">
              {currentDyno.maxTorque}
            </span>
            <span className="text-sm font-bold text-white/80">Nm</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono mt-1 text-white/70">
            <span>@{currentDyno.maxTorqueRpm} RPM</span>
            {tqDelta > 0 && <span className="text-white font-bold">+{tqDelta} Nm</span>}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black border border-white/30">
          <span className="text-[10px] font-mono text-white/50 block">DẢI LỰC KÉO (POWERBAND)</span>
          <div className="text-xl sm:text-2xl font-black font-tech text-white mt-2">
            {currentDyno.powerBand}
          </div>
          <span className="text-[10px] font-mono text-white/50 block mt-1">
            Vùng tua sinh công hữu dụng nhất
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-black border border-white/30">
          <span className="text-[10px] font-mono text-white/50 block">TỐC ĐỘ LÝ THUYẾT MAX</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl sm:text-4xl font-black font-tech text-white">
              {currentDyno.estimatedTopSpeed}
            </span>
            <span className="text-sm font-bold text-white/80">km/h</span>
          </div>
          <span className="text-[10px] font-mono text-white/50 block mt-1">
            Theo hệ số cản khí động học xe số
          </span>
        </div>
      </div>

      {/* FINE TUNING SLIDERS & CONTROLS */}
      <div className="p-5 rounded-2xl bg-black border border-white/20 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/15 pb-3">
          <GlowingStarIcon size={16} />
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            TINH CHỈNH CẤU HÌNH ĐỘ MÁY (CUSTOM ENGINE DISTORTION):
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {/* Cam Type */}
          <div>
            <label className="text-white/60 block mb-1">Cốt Cam Độ (Camshaft Profile):</label>
            <select
              value={tuningConfig.camType}
              onChange={(e) => setTuningConfig(prev => ({ ...prev, camType: e.target.value as TuningConfig['camType'] }))}
              className="w-full bg-neutral-950 border border-white/30 focus:border-white rounded-xl py-2 px-3 text-white outline-none cursor-pointer"
            >
              <option value="stock">Cam Zin (Gối thấp ~4.8mm - Ém tua)</option>
              <option value="mild_5.5mm">Cam Độ 5.5mm (Nước đề nhạy, hậu đều)</option>
              <option value="touring_cnc">Cam Touring 5.8mm CNC (Dải tua rộng)</option>
              <option value="racing_6.2mm">Cam Racing 6.2mm (Chuyên chạy sân/hậu)</option>
            </select>
          </div>

          {/* Exhaust Type */}
          <div>
            <label className="text-white/60 block mb-1">Cổ & Ống Pô Xả (Exhaust System):</label>
            <select
              value={tuningConfig.exhaustType}
              onChange={(e) => setTuningConfig(prev => ({ ...prev, exhaustType: e.target.value as TuningConfig['exhaustType'] }))}
              className="w-full bg-neutral-950 border border-white/30 focus:border-white rounded-xl py-2 px-3 text-white outline-none cursor-pointer"
            >
              <option value="stock">Pô Zin Có Vách Ngăn (Êm, ghì tua cuối)</option>
              <option value="slip_on">Pô Móc Êm Đít Zin (Thoát hơi nhẹ +4%)</option>
              <option value="free_flow_titan">Pô Độ Cổ Titan Thoáng (+9% Peak)</option>
              <option value="racing_megaphone">Pô Megaphone Racing (+14% High-End)</option>
            </select>
          </div>

          {/* ECU Mapping */}
          <div>
            <label className="text-white/60 block mb-1">IC / Mở Tua ECU (Ignition Mapping):</label>
            <select
              value={tuningConfig.ecuMapping}
              onChange={(e) => setTuningConfig(prev => ({ ...prev, ecuMapping: e.target.value as TuningConfig['ecuMapping'] }))}
              className="w-full bg-neutral-950 border border-white/30 focus:border-white rounded-xl py-2 px-3 text-white outline-none cursor-pointer"
            >
              <option value="stock">IC Zin Hãm Tua (Cắt tại 9800 RPM)</option>
              <option value="reflash_pxl">IC Độ Mở Tua PXL (Cắt tại 11500 RPM)</option>
              <option value="stand_alone_race">ECU Lập Trình Standalone (12500 RPM)</option>
            </select>
          </div>

          {/* Displacement cc */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-white/60">Dung Tích Xi-lanh (cc):</label>
              <span className="text-white font-bold">{tuningConfig.displacementCc} cc</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              value={tuningConfig.displacementCc}
              onChange={(e) => setTuningConfig(prev => ({ ...prev, displacementCc: parseInt(e.target.value) || 110 }))}
              className="w-full accent-white h-2 bg-neutral-900 rounded-lg cursor-pointer"
            />
          </div>

          {/* Compression Ratio */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-white/60">Tỉ Số Nén (CR):</label>
              <span className="text-white font-bold">{tuningConfig.cr}:1</span>
            </div>
            <input
              type="range"
              min="8.5"
              max="14.0"
              step="0.1"
              value={tuningConfig.cr}
              onChange={(e) => setTuningConfig(prev => ({ ...prev, cr: parseFloat(e.target.value) || 9.5 }))}
              className="w-full accent-white h-2 bg-neutral-900 rounded-lg cursor-pointer"
            />
          </div>

          {/* Carb Diameter */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-white/60">Cỡ Họng Bình Xăng (mm):</label>
              <span className="text-white font-bold">{tuningConfig.carbDiameterMm} mm</span>
            </div>
            <input
              type="range"
              min="14"
              max="40"
              step="1"
              value={tuningConfig.carbDiameterMm}
              onChange={(e) => setTuningConfig(prev => ({ ...prev, carbDiameterMm: parseInt(e.target.value) || 20 }))}
              className="w-full accent-white h-2 bg-neutral-900 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Dyno Sheet Modal */}
      <DynoSheetModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        dynoResult={currentDyno}
        config={tuningConfig}
      />
    </div>
  );
};
