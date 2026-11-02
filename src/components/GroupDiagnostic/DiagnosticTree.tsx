import React, { useState } from 'react';
import { DIAGNOSTIC_DATABASE } from '../../data/diagnostic-db';
import { DiagnosticItem } from '../../types';
import { playDiagnosticSound, stopEngineSound } from '../../utils/audio-synth';
import { Volume2, VolumeX } from 'lucide-react';
import { GlowingStarIcon } from '../GlowingStarIcon';

export const DiagnosticTree: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [selectedTiming, setSelectedTiming] = useState<string>('ALL');
  const [activeSoundPlaying, setActiveSoundPlaying] = useState<string | null>(null);

  const locations = ['ALL', ...Array.from(new Set(DIAGNOSTIC_DATABASE.map(d => d.location)))];
  const timings = ['ALL', ...Array.from(new Set(DIAGNOSTIC_DATABASE.map(d => d.timing)))];

  const filteredItems = DIAGNOSTIC_DATABASE.filter(item => {
    const matchLoc = selectedLocation === 'ALL' || item.location === selectedLocation;
    const matchTime = selectedTiming === 'ALL' || item.timing === selectedTiming;
    return matchLoc && matchTime;
  });

  const handlePlaySound = (item: DiagnosticItem) => {
    if (activeSoundPlaying === item.id) {
      stopEngineSound();
      setActiveSoundPlaying(null);
    } else {
      setActiveSoundPlaying(item.id);
      playDiagnosticSound(item.soundKey, 4.0);
      setTimeout(() => {
        setActiveSoundPlaying(prev => prev === item.id ? null : prev);
      }, 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 3-TIER FILTRATION BAR - PURE BLACK & WHITE */}
      <div className="p-5 rounded-2xl bg-black border border-white/20 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/15 pb-3">
          <div>
            <h3 className="text-base font-mono font-bold text-white uppercase flex items-center gap-2">
              <GlowingStarIcon size={18} />
              CÂY QUYẾT ĐỊNH BẮT BỆNH ĐỘNG CƠ (3-TIER MATRIX)
            </h3>
            <p className="text-xs text-white/60 font-mono mt-0.5">
              Lọc theo: Vị trí phát ra tiếng kêu → Thời điểm xuất hiện → Triệu chứng thực tế
            </p>
          </div>
          <span className="text-xs font-mono text-white bg-black border border-white/40 px-2.5 py-1 rounded-lg">
            Deterministic Decision Tree
          </span>
        </div>

        {/* TIER 1: LOCATION (Vị trí) */}
        <div>
          <label className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5 mb-2">
            <GlowingStarIcon size={13} />
            <span>TẦNG 1: VỊ TRÍ PHÁT TIẾNG ĐỘNG (LOCATION)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                  selectedLocation === loc
                    ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                    : 'bg-black text-white/60 border-white/20 hover:text-white hover:border-white/50'
                }`}
              >
                {loc === 'ALL' ? 'TẤT CẢ VỊ TRÍ' : loc}
              </button>
            ))}
          </div>
        </div>

        {/* TIER 2: SCENARIO / TIMING (Thời điểm) */}
        <div className="pt-3 border-t border-white/10">
          <label className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5 mb-2">
            <GlowingStarIcon size={13} />
            <span>TẦNG 2: THỜI ĐIỂM / HOÀN CẢNH XUẤT HIỆN (TIMING & LOAD)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {timings.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTiming(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                  selectedTiming === t
                    ? 'bg-white text-black border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                    : 'bg-black text-white/60 border-white/20 hover:text-white hover:border-white/50'
                }`}
              >
                {t === 'ALL' ? 'TẤT CẢ THỜI ĐIỂM' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TIER 3 & RESULTS: SYMPTOMS, SOUNDS & DIAGNOSES */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-mono text-white/60">
            Tìm thấy <strong className="text-white">{filteredItems.length}</strong> ca chẩn đoán phù hợp:
          </span>
          <span className="text-[11px] font-mono text-white/80">
            Bấm "Nghe Thử Âm Thanh" để đối chiếu tiếng xe thực tế
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map(item => {
            const isPlaying = activeSoundPlaying === item.id;
            const isCritical = item.dangerLevel === 'critical';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl bg-black border transition-all duration-300 flex flex-col justify-between ${
                  isCritical
                    ? 'border-white shadow-[0_0_18px_rgba(255,255,255,0.2)]'
                    : 'border-white/20 hover:border-white/60'
                }`}
              >
                <div>
                  {/* Card Header: Location + Danger Badge */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black text-white border border-white/40">
                        {item.location}
                      </span>
                      <span className="text-[10px] font-mono text-white/60">
                        • {item.timing}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-white text-black">
                      {item.dangerLevel}
                    </span>
                  </div>

                  {/* Symptom description */}
                  <div className="flex items-start gap-2.5 mb-3 bg-neutral-950 p-3 rounded-xl border border-white/15">
                    <GlowingStarIcon size={16} className="mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] font-mono text-white/50 uppercase block">Triệu chứng âm thanh:</span>
                      <p className="text-xs sm:text-sm font-bold text-white font-display">
                        {item.symptom}
                      </p>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="mb-3">
                    <span className="text-[10px] font-mono text-white/60 uppercase block">Kết luận chẩn đoán:</span>
                    <h4 className="text-sm sm:text-base font-black font-display text-white white-glow-text">
                      {item.diagnosis}
                    </h4>
                  </div>

                  {/* Fix instructions */}
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-white/20 mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white mb-1">
                      <GlowingStarIcon size={12} />
                      <span>HƯỚNG DẪN KHẮC PHỤC CỦA THỢ:</span>
                    </div>
                    <p className="text-xs text-white/80 font-mono leading-relaxed">
                      {item.fix}
                    </p>
                  </div>

                  {/* Specs */}
                  {item.specs.length > 0 && (
                    <div className="space-y-1 bg-black p-3 rounded-xl border border-white/15 mb-4 text-[11px] font-mono">
                      {item.specs.map((sp, sIdx) => (
                        <div key={sIdx} className="flex justify-between">
                          <span className="text-white/50">{sp.label}:</span>
                          <span className="text-white font-bold">{sp.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sound Player Button */}
                <button
                  onClick={() => handlePlaySound(item)}
                  className={`w-full py-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 border cursor-pointer ${
                    isPlaying
                      ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.6)] animate-pulse'
                      : 'bg-black hover:bg-neutral-900 text-white border-white/30 hover:border-white'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-4 h-4 text-black" />
                      <span>ĐANG PHÁT MÔ PHỎNG (BẤM ĐỂ DỪNG)</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-white" />
                      <span>NGHE TIẾNG KÊU MẪU (WEB AUDIO)</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
