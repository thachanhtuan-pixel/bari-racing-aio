import React, { useState } from 'react';
import { playDiagnosticSound, stopEngineSound } from '../../utils/audio-synth';
import { Volume2, VolumeX } from 'lucide-react';
import { GlowingStarIcon } from '../GlowingStarIcon';

export const SoundSimulator: React.FC = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);

  const sounds = [
    {
      id: 'ticking',
      name: 'Tiếng Gõ Cò Súp-Bắp (Tách Tách)',
      subtitle: 'Loose Valve Lash / Tappet Noise',
      desc: 'Âm thanh gõ kim loại thanh và nhịp nhàng ở đỉnh đầu bò. Tần số nhịp tăng giảm theo vòng tua garanti.',
      frequency: '2400 Hz -> 800 Hz',
      actionType: 'ticking' as const,
    },
    {
      id: 'knocking',
      name: 'Tiếng Piston Đụng Đầu / Mắt Súp-Bắp (Cọc Cọc)',
      subtitle: 'Piston Slap / Valve Collision',
      desc: 'Tiếng đanh, gắt như búa gõ kim loại đặc khi ép ga tải nặng. Dấu hiệu nén quá cao hoặc thiếu ron chân lòng.',
      frequency: '650 Hz -> 140 Hz',
      actionType: 'knocking' as const,
    },
    {
      id: 'whining',
      name: 'Tiếng Hú Nhông Nồi Sơ Cấp (Húuuuu)',
      subtitle: 'Clutch Primary Gear Whine',
      desc: 'Tiếng rít gió hú cao tần từ lốc nồi bên phải, âm lượng và cao độ tăng vọt theo vận tốc chạy tua cao.',
      frequency: '450 Hz -> 1600 Hz FM',
      actionType: 'whining' as const,
    },
    {
      id: 'rodknock',
      name: 'Tiếng Lột Dên / Bạc Đạn Ắc (Lộc Cộc Nặng)',
      subtitle: 'Connecting Rod Bearing Failure',
      desc: 'Tiếng đập lộc cộc trầm, nặng trịch từ đáy lốc máy. Cực kỳ nguy hiểm, nguy cơ bó kẹt dên khi đang chạy.',
      frequency: '160 Hz -> 50 Hz Low Thud',
      actionType: 'rodknock' as const,
    },
    {
      id: 'bogging',
      name: 'Tiếng Hụp Ga Đầu (Ụp Ụp Ngộp Hơi)',
      subtitle: 'Carburetor Low-End Bogging',
      desc: 'Tiếng ngộp gió lịm máy khi thốc vặn ga đột ngột. Do họng gió quá to hoặc thiếu xăng gíc-lơ phụ.',
      frequency: '180 Hz Flutter Flutter',
      actionType: 'bogging' as const,
    },
    {
      id: 'healthy',
      name: 'Tiếng Máy Zin Chuẩn (Garanti Ấm Êm)',
      subtitle: 'Healthy Balanced 4-Stroke Idle',
      desc: 'Tiếng thì thầm nhịp nhàng của động cơ hoạt động hoàn hảo, khe hở xúp-páp chuẩn và lửa xăng cân đối.',
      frequency: '80 Hz + 22 Hz LFO Thrum',
      actionType: 'healthy' as const,
    }
  ];

  const handleToggle = (soundId: string, actionType: typeof sounds[0]['actionType']) => {
    if (activeSound === soundId) {
      stopEngineSound();
      setActiveSound(null);
    } else {
      setActiveSound(soundId);
      playDiagnosticSound(actionType, 5.0);
      setTimeout(() => {
        setActiveSound(prev => prev === soundId ? null : prev);
      }, 5000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-black border border-white/20">
        <div className="flex justify-between items-center border-b border-white/15 pb-3 mb-4">
          <div>
            <h3 className="text-base font-mono font-bold text-white uppercase flex items-center gap-2">
              <GlowingStarIcon size={18} />
              PHÒNG THÍ NGHIỆM GIẢ LẬP ÂM THANH ĐỘNG CƠ (WEB AUDIO SYNTH)
            </h3>
            <p className="text-xs text-white/60 font-mono mt-0.5">
              Bộ tổng hợp âm thanh kỹ thuật số tái hiện chính xác dao động cơ học để thợ đối chiếu bắt bệnh
            </p>
          </div>
          <span className="text-xs font-mono text-white bg-black border border-white/40 px-2.5 py-1 rounded-lg">
            Zero-Latency Offline
          </span>
        </div>

        {/* Audio Sound Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sounds.map(s => {
            const isPlaying = activeSound === s.id;
            return (
              <div
                key={s.id}
                className={`p-4 rounded-2xl bg-black border transition-all duration-300 flex flex-col justify-between ${
                  isPlaying
                    ? 'border-white shadow-[0_0_25px_rgba(255,255,255,0.4)]'
                    : 'border-white/20 hover:border-white/50'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-950 border border-white/20 text-white/60">
                      {s.frequency}
                    </span>
                    <GlowingStarIcon size={14} className={isPlaying ? 'animate-bounce' : 'opacity-60'} />
                  </div>

                  <h4 className="text-sm font-bold text-white font-display">
                    {s.name}
                  </h4>
                  <p className="text-[11px] font-mono text-white/80 mb-2 uppercase">
                    {s.subtitle}
                  </p>
                  <p className="text-xs text-white/70 font-mono leading-relaxed mb-4">
                    {s.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleToggle(s.id, s.actionType)}
                  className={`w-full py-2.5 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 border cursor-pointer ${
                    isPlaying
                      ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.6)]'
                      : 'bg-black hover:bg-neutral-900 text-white border-white/30 hover:border-white'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <VolumeX className="w-4 h-4 text-black" />
                      <span>DỪNG PHÁT</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-white" />
                      <span>NGHE ÂM THANH MẪU</span>
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
