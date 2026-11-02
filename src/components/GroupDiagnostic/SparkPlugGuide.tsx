import React, { useState } from 'react';
import { GlowingStarIcon } from '../GlowingStarIcon';

export const SparkPlugGuide: React.FC = () => {
  const [selectedCondition, setSelectedCondition] = useState<number>(0);

  const plugConditions = [
    {
      id: 0,
      title: 'Màu Đỏ Gạch / Nâu Cam Cà Phê (Chuẩn Tối Ưu)',
      badge: 'PERFECT STOICHIOMETRIC AFR ~13.0 - 13.5',
      statusText: 'HÒA KHÍ CHUẨN HOÀN HẢO',
      description: 'Chấu sứ bugi có màu đỏ gạch nung hoặc nâu nhạt đồng đều, khô ráo, không bám cặn than.',
      meaning: 'Tỉ lệ xăng/gió (AFR) đạt tối ưu, góc đánh lửa chuẩn, buồng đốt sinh công suất cao nhất mà không bị nóng máy.',
      action: 'Giữ nguyên cấu hình gíc-lơ và kim xăng. Động cơ đang ở trạng thái đỉnh cao.'
    },
    {
      id: 1,
      title: 'Màu Trắng Bệch / Xám Tro Khô (Thiếu Xăng - Lean)',
      badge: 'LEAN AFR > 14.7 (DANGEROUS)',
      statusText: 'CỰC KỲ NGUY HIỂM: RÁT MÁY / RỐC',
      description: 'Đầu sứ bugi trắng tinh, có thể có bọt sần sùi hoặc chấu điện cực mòn vẹt nhanh.',
      meaning: 'Quá nhiều gió, thiếu xăng. Nhiệt độ buồng đốt vượt ngưỡng 850°C, nguy cơ lủng đỉnh piston, cháy xúp-páp nạp.',
      action: 'Tăng ngay gíc-lơ chính (Main Jet) lên 2-4 số. Nâng kim xăng lên 1 nấc. Kiểm tra ron co xăng xem có bị hở hút gió phụ không.'
    },
    {
      id: 2,
      title: 'Màu Đen Khô / Muội Than Dày (Dư Xăng - Rich)',
      badge: 'RICH AFR < 11.5',
      statusText: 'DƯ XĂNG: Ỳ MÁY / HAO XĂNG',
      description: 'Muội than đen khô mịn bám dày kín đầu ren và chấu sứ bugi, có mùi xăng sống ở pô.',
      meaning: 'Xăng vào quá nhiều không cháy hết. Xe chạy bị nặng máy, lỳ ga, ngộp xăng khi thốc tua và cực kỳ hao xăng.',
      action: 'Hạ gíc-lơ chính xuống 1-2 size. Kiểm tra lọc gió có bị nghẹt bụi không. Hạ phe kim xăng xuống 1 nấc.'
    },
    {
      id: 3,
      title: 'Màu Đen Ướt / Nhờn Dầu Nhớt (Hở Bạc / Lòn Nhớt)',
      badge: 'OIL LEAK INTO COMBUSTION CHAMBER',
      statusText: 'HƯ HỎNG CƠ KHÍ: HAO NHỚT NẶNG',
      description: 'Bugi ướt nhẹp nhớt đen bóng, xe xả khói trắng hoặc khói xanh ở ống pô khi lên ga.',
      meaning: 'Nhớt máy lọt vào buồng nổ qua phốt xúp-páp (phốt ghít) bị chai hoặc bộ bạc xéc-măng piston bị mòn hở.',
      action: 'Rã đầu lòng: Thay phốt xúp-páp mới, thay bộ bạc xéc-măng hoặc xoáy nòng lên cos mới nếu lòng đã bị xước khuyết.'
    }
  ];

  const current = plugConditions[selectedCondition];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-black border border-white/20">
        <div className="flex justify-between items-center border-b border-white/15 pb-3 mb-4">
          <div>
            <h3 className="text-base font-mono font-bold text-white uppercase flex items-center gap-2">
              <GlowingStarIcon size={18} />
              SỔ TAY BẮT BỆNH QUA MÀU ĐẦU BUGI (SPARK PLUG READING)
            </h3>
            <p className="text-xs text-white/60 font-mono mt-0.5">
              Cách đọc tình trạng hòa khí xăng gió và sức khỏe buồng đốt chính xác nhất của thợ máy
            </p>
          </div>
        </div>

        {/* Condition Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
          {plugConditions.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedCondition(item.id)}
              className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                selectedCondition === item.id
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                  : 'bg-black border-white/20 text-white/70 hover:border-white/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <GlowingStarIcon size={12} />
                <span className={`text-xs font-mono font-bold line-clamp-1 ${selectedCondition === item.id ? 'text-black' : 'text-white'}`}>{item.title}</span>
              </div>
              <span className={`text-[10px] font-mono uppercase font-bold block ${selectedCondition === item.id ? 'text-black/80' : 'text-white/60'}`}>
                {item.statusText}
              </span>
            </button>
          ))}
        </div>

        {/* Detailed Condition Card */}
        <div className="p-5 rounded-2xl bg-black border border-white/30 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-white/15 pb-3">
            <div>
              <span className="text-xs font-mono text-white/50 uppercase block">TÌNH TRẠNG BUGI HIỆN TẠI:</span>
              <h4 className="text-base sm:text-lg font-black font-display text-white mt-0.5">
                {current.title}
              </h4>
            </div>
            <span 
              className="px-3 py-1 rounded-full text-xs font-mono font-black border border-white bg-black text-white shadow-[0_0_10px_rgba(255,255,255,0.25)]"
            >
              {current.badge}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/20">
              <span className="text-white/50 uppercase block mb-1">1. ĐẶC ĐIỂM NHẬN BIẾT:</span>
              <p className="text-white leading-relaxed">{current.description}</p>
            </div>

            <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/20">
              <span className="text-white/50 uppercase block mb-1">2. NGUYÊN NHÂN KỸ THUẬT:</span>
              <p className="text-white/80 leading-relaxed">{current.meaning}</p>
            </div>

            <div className="bg-neutral-950 p-3.5 rounded-xl border border-white/40">
              <span className="text-white uppercase block mb-1 font-bold">3. CÁCH KHẮC PHỤC CỦA THỢ:</span>
              <p className="text-white leading-relaxed font-bold">{current.action}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
