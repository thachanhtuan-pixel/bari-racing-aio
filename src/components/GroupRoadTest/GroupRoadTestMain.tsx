import React, { useState, useEffect } from 'react';
import { GPSSpeedometer } from './GPSSpeedometer';
import { RunHistoryLogs } from './RunHistoryLogs';
import { GPSTestRun } from '../../types';
import { GlowingStarIcon } from '../GlowingStarIcon';

interface GroupRoadTestMainProps {
  onBackToMenu: () => void;
}

export const GroupRoadTestMain: React.FC<GroupRoadTestMainProps> = ({ onBackToMenu }) => {
  const [activeSubTab, setActiveSubTab] = useState<'speedometer' | 'history'>('speedometer');
  const [runs, setRuns] = useState<GPSTestRun[]>([]);
  const [vehicleName, setVehicleName] = useState<string>('Sirius 110 Zin');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bari_racing_runs');
      if (saved) {
        setRuns(JSON.parse(saved));
      }
    } catch {
      // Ignored
    }
  }, []);

  const handleSaveRun = (newRun: GPSTestRun) => {
    const updated = [newRun, ...runs].slice(0, 30);
    setRuns(updated);
    try {
      localStorage.setItem('bari_racing_runs', JSON.stringify(updated));
    } catch {
      // Ignored
    }
  };

  const handleClearLogs = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả lịch sử lượt chạy?')) {
      setRuns([]);
      try {
        localStorage.removeItem('bari_racing_runs');
      } catch {
        // Ignored
      }
    }
  };

  const subTabs = [
    { id: 'speedometer', label: '1. Đồng Hồ GPS & Đo 25-80 km/h' },
    { id: 'history', label: `2. Nhật Ký Lượt Chạy (${runs.length})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      {/* Sub Tabs Navigation */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 mb-6 border-b border-white/20">
        <div className="flex items-center gap-1.5 sm:gap-2">
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

        {/* Vehicle tag selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/60 hidden md:inline">Tên xe test:</span>
          <input
            type="text"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
            placeholder="Tên xe..."
            className="bg-neutral-950 border border-white/30 focus:border-white text-white text-xs font-mono px-3 py-1.5 rounded-xl outline-none w-36 sm:w-48"
          />
        </div>
      </div>

      {/* Content */}
      {activeSubTab === 'speedometer' && (
        <GPSSpeedometer
          onSaveRun={handleSaveRun}
          vehicleName={vehicleName}
        />
      )}

      {activeSubTab === 'history' && (
        <RunHistoryLogs
          runs={runs}
          onClearLogs={handleClearLogs}
        />
      )}
    </div>
  );
};
