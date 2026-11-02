import React from 'react';
import { DynoResult } from '../../types';
import { TuningConfig } from '../../utils/virtual-dyno';
import { Printer, X } from 'lucide-react';
import { GlowingStarIcon } from '../GlowingStarIcon';

interface DynoSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  dynoResult: DynoResult;
  config: TuningConfig;
}

export const DynoSheetModal: React.FC<DynoSheetModalProps> = ({
  isOpen,
  onClose,
  dynoResult,
  config
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-black border-2 border-white p-6 sm:p-8 shadow-[0_0_50px_rgba(255,255,255,0.3)] relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition cursor-pointer border border-white/20"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Certificate Header */}
        <div className="text-center border-b-2 border-white/20 pb-6 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black border border-white text-white text-xs font-mono mb-2 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
            <GlowingStarIcon size={14} />
            <span>BARI RACING PERFORMANCE CERTIFICATE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white uppercase">
            PHIẾU ĐO CÔNG SUẤT VIRTUAL DYNO
          </h2>
          <p className="text-xs text-white/60 font-mono mt-1">
            Mã kiểm định: BR-DYNO-{Math.floor(100000 + Math.random() * 900000)} • Chuẩn SAE J1349 • Black & White Edition
          </p>
        </div>

        {/* Main Dyno Readout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-6">
          <div className="bg-neutral-950 p-4 rounded-2xl border border-white/25">
            <span className="text-[10px] font-mono text-white/50 block">CÔNG SUẤT ĐỈNH (PEAK)</span>
            <div className="text-3xl font-black font-tech text-white white-glow-text mt-1">
              {dynoResult.peakHp}
            </div>
            <span className="text-xs font-mono text-white/70">HP @ {dynoResult.peakHpRpm} RPM</span>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-white/25">
            <span className="text-[10px] font-mono text-white/50 block">MOMEN XOẮN CỰC ĐẠI</span>
            <div className="text-3xl font-black font-tech text-white mt-1">
              {dynoResult.maxTorque}
            </div>
            <span className="text-xs font-mono text-white/70">Nm @ {dynoResult.maxTorqueRpm} RPM</span>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-white/25">
            <span className="text-[10px] font-mono text-white/50 block">DẢI POWERBAND</span>
            <div className="text-xl font-black font-tech text-white mt-2">
              {dynoResult.powerBand}
            </div>
            <span className="text-[10px] font-mono text-white/50">Dải lực kéo hữu dụng</span>
          </div>

          <div className="bg-neutral-950 p-4 rounded-2xl border border-white/25">
            <span className="text-[10px] font-mono text-white/50 block">TỐC ĐỘ LÝ THUYẾT</span>
            <div className="text-3xl font-black font-tech text-white mt-1">
              {dynoResult.estimatedTopSpeed}
            </div>
            <span className="text-xs font-mono text-white/70">km/h</span>
          </div>
        </div>

        {/* Specification Table */}
        <div className="bg-neutral-950 rounded-2xl p-4 border border-white/20 mb-6 font-mono text-xs space-y-2">
          <div className="text-white font-bold uppercase text-[11px] mb-2 flex items-center gap-1.5">
            <GlowingStarIcon size={14} />
            <span>CẤU HÌNH PHẦN CỨNG XE THỬ NGHIỆM:</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-white/80">
            <div className="flex justify-between">
              <span className="text-white/50">Tên bài độ:</span>
              <strong className="text-white">{config.name}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Dung tích:</span>
              <strong className="text-white">{config.displacementCc} cc</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Tỉ số nén (CR):</span>
              <strong className="text-white">{config.cr} : 1</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Cỡ họng bình xăng:</span>
              <strong className="text-white">{config.carbDiameterMm} mm</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Cốt cam:</span>
              <strong className="text-white">{config.camType}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Hệ thống pô xả:</span>
              <strong className="text-white">{config.exhaustType}</strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3.5 rounded-xl bg-white text-black font-mono font-black text-xs hover:bg-neutral-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            <Printer className="w-4 h-4 text-black" />
            <span>IN / LƯU PHIẾU PDF (PRINT SHEET)</span>
          </button>
          <button
            onClick={onClose}
            className="py-3.5 px-6 rounded-xl bg-black hover:bg-neutral-900 text-white font-mono font-bold text-xs border border-white/30 transition cursor-pointer"
          >
            ĐÓNG
          </button>
        </div>
      </div>
    </div>
  );
};
