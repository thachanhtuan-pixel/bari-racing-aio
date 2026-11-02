import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import { GlowingStarIcon, StarBadge } from './GlowingStarIcon';

export type FeatureGroupId = 'engine' | 'diagnostic' | 'dyno' | 'roadtest';

interface MainMenuProps {
  onSelectGroup: (groupId: FeatureGroupId) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectGroup }) => {
  const featureGroups = [
    {
      id: 'engine' as FeatureGroupId,
      index: '01',
      title: 'CƠ KHÍ & ĐỘNG CƠ',
      subTitle: 'ENGINE & DISPLACEMENT CALCULATOR',
      description: 'Tính toán dung tích xilanh (cc), tỉ số nén hình học (CR), canh họng xăng / bình xăng con & tỉ số truyền nhông sên dĩa (NSD).',
      badge: 'CC • CR • AIRFLOW • NSD',
      features: [
        'Tính dung tích xilanh (Bore x Stroke -> cc)',
        'Tỉ số nén hình học (CR) & Khuyến nghị xăng A95/Đua',
        'Canh bình xăng con & Cảnh báo hụp ga đầu (-15% đề / +20% hậu)',
        'Tra cứu cấu hình Zin xe máy Việt Nam (Wave, Sirius, Ex, Winner...)',
        'Tính nhông sên dĩa (NSD) & Tốc độ lý thuyết'
      ]
    },
    {
      id: 'diagnostic' as FeatureGroupId,
      index: '02',
      title: 'CHẨN ĐOÁN & ÂM THANH BỆNH XE',
      subTitle: 'MECHANICAL DIAGNOSTIC & NOISE MATRIX',
      description: 'Cây quyết định 3 tầng lọc: Vị trí -> Thời điểm -> Triệu chứng âm thanh. Kèm máy phát âm thanh mô phỏng tiếng kêu cơ khí Web Audio.',
      badge: '3-TIER MATRIX & AUDIO',
      features: [
        'Bắt bệnh 3 tầng lọc (Đầu bò, lốc nồi, dên, bình xăng)',
        'Trình giả lập âm thanh mẫu (Gõ cò, piston slap, hú nồi, lột dên)',
        'Sổ tay trị bệnh & Thông số khe hở nhiệt xúp-páp chuẩn',
        'Bảng giải mã màu sắc đầu bugi (Thiếu xăng / Dư xăng)'
      ]
    },
    {
      id: 'dyno' as FeatureGroupId,
      index: '03',
      title: 'VIRTUAL DYNO LITE',
      subTitle: 'HP & TORQUE PERFORMANCE CURVE',
      description: 'Mô phỏng đường cong công suất (HP) và momen xoắn (Nm) theo dải tua 2000 - 12000 RPM dựa trên hiệu suất nạp (VE) và cấu hình máy.',
      badge: 'REALTIME CANVAS DYNO',
      features: [
        'Biểu đồ đồ thị Canvas interactive mượt mà 60 FPS',
        'Tính Peak HP @ RPM, Max Torque @ RPM & Redline',
        'Mô phỏng bài độ: Zin, PXL (Pô Xăng Lửa), Cam Xăng Nồi, 54zz, 62zz',
        'Xuất phiếu Bari Racing Dyno Sheet chứng nhận'
      ]
    },
    {
      id: 'roadtest' as FeatureGroupId,
      index: '04',
      title: 'TEST ĐƯỜNG PHỐ & GPS TIMER',
      subTitle: 'ROAD TEST SPEEDOMETER & RUN TIMER',
      description: 'Bấm giờ gia tốc tự động bằng GPS: Tự kích hoạt tại mốc 25 km/h và chốt giờ tại 80 km/h. Kèm đồng hồ LCD Koso và chế độ thử xưởng.',
      badge: '25 -> 80 KM/H TRIGGER',
      features: [
        'Tự động bắt trigger gia tốc GPS không cần bấm tay',
        'Đồng hồ tốc độ kỹ thuật số phong cách LCD Y2K',
        'Chế độ Workshop Simulator thử nghiệm tại xưởng',
        'Nhật ký chạy thử (Run Log) so sánh thời gian & G-force'
      ]
    }
  ];

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Workshop Hero Header */}
      <div className="mb-8 text-center sm:text-left relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black border border-white/40 text-xs font-mono text-white mb-3 shadow-[0_0_12px_rgba(255,255,255,0.2)]">
          <GlowingStarIcon size={14} />
          <span>GARAGE WORKSHOP EDITION • HIGH PRECISION CALCULATOR</span>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-display tracking-tight text-white uppercase">
            BARI RACING <span className="text-white underline decoration-white/40">ALL-IN-ONE</span>
          </h1>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white text-black">
            BLACK & WHITE EDITION
          </span>
        </div>

        <p className="text-sm sm:text-base text-white/70 max-w-3xl mt-2 leading-relaxed font-mono">
          Ứng dụng đa chức năng chuyên sâu cho thợ máy & dân chơi xe: Tính toán thông số cơ khí, chẩn đoán bắt bệnh, mô phỏng bàn Dyno và đo gia tốc thực địa.
        </p>

        {/* Monochrome deco line */}
        <div className="mt-5 h-[1px] w-full bg-gradient-to-r from-white via-white/30 to-transparent" />
      </div>

      {/* THE 4 BIG ROUNDED BUTTON GROUPS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {featureGroups.map((group) => {
          return (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className="group text-left relative overflow-hidden rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-[#121212] via-[#090909] to-[#000000] border-2 border-white/20 hover:border-white hover:shadow-[0_0_35px_rgba(255,255,255,0.22)] transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex flex-col justify-between"
            >
              {/* Background ambient lighting */}
              <div 
                className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition pointer-events-none bg-white"
              />

              {/* Decorative Corner Badge with Glowing Star */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black border border-white/40 text-white shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                  {group.badge}
                </span>
                <GlowingStarIcon size={16} />
              </div>

              <div>
                {/* Header Star Icon + Number */}
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center bg-black border border-white/60 group-hover:border-white group-hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition transform group-hover:scale-105"
                  >
                    <GlowingStarIcon size={30} />
                  </div>
                  <div>
                    <span className="text-xs font-mono tracking-widest text-white/50">
                      NHÓM {group.index}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black font-display text-white tracking-wide group-hover:text-white transition">
                      {group.title}
                    </h2>
                  </div>
                </div>

                {/* Subtitle & Description */}
                <p className="text-xs font-mono uppercase tracking-wider text-white font-bold mb-2">
                  {group.subTitle}
                </p>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-4 font-mono">
                  {group.description}
                </p>

                {/* Features Inside Checklist */}
                <div className="space-y-2 mb-5 bg-black/80 rounded-2xl p-4 border border-white/15">
                  <div className="text-[11px] font-mono text-white/80 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <GlowingStarIcon size={13} />
                    <span>Các tính năng có trong nhóm:</span>
                  </div>
                  {group.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-white/80">
                      <GlowingStarIcon size={12} className="mt-0.5 shrink-0" />
                      <span className="group-hover:text-white transition font-mono">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Strip */}
              <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold font-mono">
                <span className="text-white/50 group-hover:text-white/80 transition">
                  MỞ NHÓM TÍNH NĂNG
                </span>
                <div 
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-black transition transform group-hover:translate-x-1 shadow-[0_0_12px_rgba(255,255,255,0.35)]"
                >
                  <span>TRUY CẬP NGAY</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Workshop Quick Info Banner */}
      <div className="mt-8 p-4 rounded-2xl bg-black border border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-white/70">
        <div className="flex items-center gap-2">
          <GlowingStarIcon size={16} />
          <span>BARI RACING ENGINE LAB • CHUẨN CƠ KHÍ & KHÍ ĐỘNG HỌC THỰC TẾ</span>
        </div>
        <div className="flex items-center gap-4 text-white/80">
          <span>Phiên bản: <strong className="text-white">v2.4 PWA</strong></span>
          <span>Offline: <strong className="text-white">Sẵn sàng</strong></span>
          <span>Màu sắc: <strong className="text-white">Đen & Trắng</strong></span>
        </div>
      </div>
    </div>
  );
};
