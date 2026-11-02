import React, { useState } from 'react';
import { EngineCalculator } from './EngineCalculator';
import { CarburetorJetting } from './CarburetorJetting';
import { StockDbLookup } from './StockDbLookup';
import { SprocketGearCalc } from './SprocketGearCalc';
import { GlowingStarIcon } from '../GlowingStarIcon';

interface GroupEngineMainProps {
  onBackToMenu: () => void;
}

export const GroupEngineMain: React.FC<GroupEngineMainProps> = ({ onBackToMenu }) => {
  const [activeSubTab, setActiveSubTab] = useState<'calc' | 'carb' | 'stock' | 'sprocket'>('calc');

  const subTabs = [
    { id: 'calc', label: '1. Dung Tích cc & Nén CR' },
    { id: 'carb', label: '2. Bình Xăng & Airflow' },
    { id: 'stock', label: '3. Tra Cứu Xe Zin VN' },
    { id: 'sprocket', label: '4. Nhông Sên Dĩa (NSD)' },
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
      {activeSubTab === 'calc' && <EngineCalculator onApplyCarbTab={() => setActiveSubTab('carb')} />}
      {activeSubTab === 'carb' && <CarburetorJetting />}
      {activeSubTab === 'stock' && (
        <StockDbLookup 
          onSelectSpec={(spec) => {
            setActiveSubTab('calc');
          }} 
        />
      )}
      {activeSubTab === 'sprocket' && <SprocketGearCalc />}
    </div>
  );
};
