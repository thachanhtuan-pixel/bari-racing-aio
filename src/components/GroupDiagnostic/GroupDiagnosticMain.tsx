import React, { useState } from 'react';
import { DiagnosticTree } from './DiagnosticTree';
import { SoundSimulator } from './SoundSimulator';
import { SparkPlugGuide } from './SparkPlugGuide';
import { GlowingStarIcon } from '../GlowingStarIcon';

interface GroupDiagnosticMainProps {
  onBackToMenu: () => void;
}

export const GroupDiagnosticMain: React.FC<GroupDiagnosticMainProps> = ({ onBackToMenu }) => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'sound' | 'plug'>('matrix');

  const subTabs = [
    { id: 'matrix', label: '1. Cây Bắt Bệnh 3 Tầng' },
    { id: 'sound', label: '2. Giả Lập Âm Thanh Mẫu' },
    { id: 'plug', label: '3. So Màu Đầu Bugi' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 mb-6 border-b border-white/20">
        {subTabs.map(tab => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold whitespace-nowrap transition cursor-pointer active:scale-95 border ${
                isActive
                  ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                  : 'bg-black text-white/70 border-white/20 hover:text-white hover:border-white/50'
              }`}
            >
              <GlowingStarIcon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeSubTab === 'matrix' && <DiagnosticTree />}
      {activeSubTab === 'sound' && <SoundSimulator />}
      {activeSubTab === 'plug' && <SparkPlugGuide />}
    </div>
  );
};
