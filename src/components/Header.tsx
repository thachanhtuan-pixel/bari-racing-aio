import React, { useState } from 'react';
import { usePWAInstall, useOnlineStatus } from '../utils/usePWAInstall';
import { ChevronLeft, Download, X } from 'lucide-react';
import { GlowingStarIcon } from './GlowingStarIcon';

interface HeaderProps {
  currentGroup: string | null;
  onBackToMenu: () => void;
  groupTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ currentGroup, onBackToMenu, groupTitle }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [showIOSModal, setShowIOSModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
        {/* Top monochrome racing line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-white to-transparent w-full opacity-60" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {currentGroup && (
              <button
                onClick={onBackToMenu}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black hover:bg-neutral-900 border border-white/40 hover:border-white text-white text-xs sm:text-sm font-bold transition active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.15)]"
                title="Quay lại Menu Chính"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">MENU CHÍNH</span>
                <span className="sm:hidden">MENU</span>
              </button>
            )}

            {/* TOP-LEFT LOGO: BARI_RACING.PNG */}
            <div 
              onClick={onBackToMenu}
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              <div className="h-9 sm:h-11 flex items-center justify-center p-0.5 transition transform group-hover:scale-102">
                <img 
                  src="/bari_racing.png" 
                  alt="Bari Racing" 
                  className="h-8 sm:h-10 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                  onError={(e) => {
                    // Fallback if needed
                    const target = e.currentTarget;
                    target.src = '/assets/aistudio/bari_racing_c0384eef.png';
                  }}
                />
              </div>

              {groupTitle && (
                <div className="hidden lg:flex items-center gap-2 border-l border-white/20 pl-3">
                  <GlowingStarIcon size={14} />
                  <p className="text-xs text-white/80 font-mono tracking-wider truncate max-w-md">
                    {groupTitle}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Action buttons & status indicators in pure Black & White */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isOnline && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black border border-white/80 text-white text-[11px] font-mono animate-pulse">
                <GlowingStarIcon size={12} />
                <span>OFFLINE MODE</span>
              </div>
            )}

            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-black border border-white/30 text-[11px] font-mono text-white/80">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>PWA OFFLINE READY</span>
            </div>

            {/* PWA Install Button */}
            {isInstallable && (
              <button
                onClick={install}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs shadow-[0_0_15px_rgba(255,255,255,0.5)] transition active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CÀI APP</span>
              </button>
            )}

            {isIOS && !isInstalled && (
              <button
                onClick={() => setShowIOSModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-900 border border-white/60 text-white text-xs font-bold shadow-[0_0_10px_rgba(255,255,255,0.2)]"
              >
                <GlowingStarIcon size={12} />
                <span>Cài iOS</span>
              </button>
            )}

            {isInstalled && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black border border-white/40 text-white text-[11px] font-mono">
                <GlowingStarIcon size={12} />
                <span className="hidden sm:inline">INSTALLED</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-black border-2 border-white p-6 shadow-[0_0_40px_rgba(255,255,255,0.3)] text-white">
            <div className="flex items-center justify-between mb-4 border-b border-white/20 pb-3">
              <div className="flex items-center gap-2">
                <GlowingStarIcon size={20} />
                <h3 className="text-base font-bold font-display uppercase tracking-wide">Cài Đặt Trên iPhone / iPad</h3>
              </div>
              <button onClick={() => setShowIOSModal(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-white/80 leading-relaxed mb-4 font-mono">
              Để dùng Bari Racing AIO mượt mà toàn màn hình và hoạt động hoàn toàn offline:
            </p>
            <ol className="text-xs text-white space-y-2 list-decimal list-inside bg-neutral-950 p-3 rounded-2xl border border-white/20 font-mono">
              <li>Bấm nút <strong className="text-white underline">Chia sẻ (Share)</strong> ở thanh Safari.</li>
              <li>Cuộn xuống chọn <strong className="text-white underline">Thêm vào Màn hình chính (Add to Home Screen)</strong>.</li>
              <li>Bấm <strong className="text-white underline">Thêm (Add)</strong> ở góc trên bên phải.</li>
            </ol>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-white text-black font-mono font-black text-xs hover:bg-neutral-200 transition cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            >
              ĐÃ HIỂU
            </button>
          </div>
        </div>
      )}
    </>
  );
};
