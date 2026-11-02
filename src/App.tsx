import React, { useState } from 'react';
import { Header } from './components/Header';
import { MainMenu, FeatureGroupId } from './components/MainMenu';
import { GroupEngineMain } from './components/GroupEngineCalc/GroupEngineMain';
import { GroupDiagnosticMain } from './components/GroupDiagnostic/GroupDiagnosticMain';
import { GroupVirtualDynoMain } from './components/GroupVirtualDyno/GroupVirtualDynoMain';
import { GroupRoadTestMain } from './components/GroupRoadTest/GroupRoadTestMain';
import { stopEngineSound } from './utils/audio-synth';
import { Home } from 'lucide-react';
import { GlowingStarIcon } from './components/GlowingStarIcon';

export default function App() {
  const [activeGroup, setActiveGroup] = useState<FeatureGroupId | null>(null);

  // Group metadata for titles & breadcrumbs (Strictly Black & White)
  const groupMetadata: Record<FeatureGroupId, { title: string; label: string }> = {
    engine: {
      title: 'NHÓM 1: CƠ KHÍ & ĐỘNG CƠ (CC, CR, BÌNH XĂNG, NSD)',
      label: 'CƠ KHÍ & ĐỘNG CƠ'
    },
    diagnostic: {
      title: 'NHÓM 2: CHẨN ĐOÁN & ÂM THANH BỆNH XE (3-TIER MATRIX)',
      label: 'CHẨN ĐOÁN BỆNH XE'
    },
    dyno: {
      title: 'NHÓM 3: VIRTUAL DYNO LITE (MÔ PHỎNG HP & NM)',
      label: 'VIRTUAL DYNO'
    },
    roadtest: {
      title: 'NHÓM 4: TEST ĐƯỜNG PHỐ & GPS TIMER (25-80 KM/H)',
      label: 'GPS ROAD TEST'
    }
  };

  const handleSelectGroup = (groupId: FeatureGroupId) => {
    stopEngineSound();
    setActiveGroup(groupId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToMenu = () => {
    stopEngineSound();
    setActiveGroup(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black workshop-grid">
      {/* App Header */}
      <Header
        currentGroup={activeGroup}
        onBackToMenu={handleBackToMenu}
        groupTitle={activeGroup ? groupMetadata[activeGroup].title : undefined}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeGroup === null ? (
          // Main Menu with 4 Big Rounded Buttons
          <MainMenu onSelectGroup={handleSelectGroup} />
        ) : (
          <div>
            {/* Quick Group Switcher Bar - Monochrome Black & White */}
            <div className="bg-black/90 border-b border-white/20 sticky top-[57px] z-30 shadow-lg backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={handleBackToMenu}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-900 border border-white/40 text-xs font-mono font-bold text-white transition cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5 text-white" />
                    <span className="hidden sm:inline">MENU CHÍNH</span>
                  </button>

                  {/* The 4 Group Quick Selectors */}
                  {(['engine', 'diagnostic', 'dyno', 'roadtest'] as FeatureGroupId[]).map((gId) => {
                    const meta = groupMetadata[gId];
                    const isActive = activeGroup === gId;
                    return (
                      <button
                        key={gId}
                        onClick={() => handleSelectGroup(gId)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition cursor-pointer border ${
                          isActive
                            ? 'bg-white text-black border-white font-black shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                            : 'bg-black text-white/70 border-white/20 hover:text-white hover:border-white/60'
                        }`}
                      >
                        <GlowingStarIcon size={12} />
                        <span className="hidden sm:inline">{meta.label}</span>
                        <span className="sm:hidden">{gId === 'engine' ? 'CƠ KHÍ' : gId === 'diagnostic' ? 'BỆNH XE' : gId === 'dyno' ? 'DYNO' : 'ROAD TEST'}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-white/60">
                  <GlowingStarIcon size={12} />
                  <span>HIGH PRECISION ENGINE COMPUTATION</span>
                </div>
              </div>
            </div>

            {/* Active Group Content */}
            <div className="animate-fadeIn">
              {activeGroup === 'engine' && <GroupEngineMain onBackToMenu={handleBackToMenu} />}
              {activeGroup === 'diagnostic' && <GroupDiagnosticMain onBackToMenu={handleBackToMenu} />}
              {activeGroup === 'dyno' && <GroupVirtualDynoMain onBackToMenu={handleBackToMenu} />}
              {activeGroup === 'roadtest' && <GroupRoadTestMain onBackToMenu={handleBackToMenu} />}
            </div>
          </div>
        )}
      </main>

      {/* Workshop Garage Footer - Pure Black & White */}
      <footer className="bg-black border-t border-white/20 py-6 px-4 text-center text-xs font-mono text-white/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GlowingStarIcon size={14} />
            <span className="text-white font-bold">BARI RACING AIO</span>
            <span>• Progressive Web App (PWA) Offline • Black & White Edition</span>
          </div>
          <div className="text-white/40">
            © Bari Racing Workshop System • Thiết kế cho ngón tay dính nhớt
          </div>
        </div>
      </footer>
    </div>
  );
}
