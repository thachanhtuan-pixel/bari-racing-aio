import React, { useState, useEffect, useRef } from 'react';
import { GPSTestRun } from '../../types';
import { Play, Square, RotateCcw } from 'lucide-react';
import { GlowingStarIcon } from '../GlowingStarIcon';

interface GPSSpeedometerProps {
  onSaveRun: (run: GPSTestRun) => void;
  vehicleName: string;
}

export const GPSSpeedometer: React.FC<GPSSpeedometerProps> = ({ onSaveRun, vehicleName }) => {
  const [currentSpeedKmh, setCurrentSpeedKmh] = useState<number>(0);
  const [maxSpeedReached, setMaxSpeedReached] = useState<number>(0);
  const [status, setStatus] = useState<'IDLE' | 'ARMED' | 'RECORDING' | 'FINISHED'>('IDLE');
  const [elapsedTimeMs, setElapsedTimeMs] = useState<number>(0);
  const [lastFinishedRun, setLastFinishedRun] = useState<GPSTestRun | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(false);
  const [simThrottle, setSimThrottle] = useState<number>(0);

  const startTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const speedHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (timerIntervalRef.current !== null) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const startGPS = () => {
    if (!('geolocation' in navigator)) {
      alert('Thiết bị hoặc trình duyệt không hỗ trợ Geolocation GPS. Bạn có thể dùng chế độ Giả Lập Xưởng (Workshop Mode) bên dưới.');
      return;
    }

    setStatus('ARMED');
    setElapsedTimeMs(0);
    setMaxSpeedReached(0);
    speedHistoryRef.current = [];

    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsAccuracy(pos.coords.accuracy);
        const rawSpeed = pos.coords.speed;
        const kmh = rawSpeed && rawSpeed > 0 ? Number((rawSpeed * 3.6).toFixed(1)) : 0;
        processSpeedInput(kmh);
      },
      (err) => {
        console.warn('[GPS] Position error:', err);
      },
      options
    );
  };

  const stopGPS = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setStatus('IDLE');
  };

  const processSpeedInput = (speed: number) => {
    setCurrentSpeedKmh(speed);
    setMaxSpeedReached(prev => Math.max(prev, speed));
    speedHistoryRef.current.push(speed);

    if (status === 'ARMED') {
      if (speed >= 25) {
        setStatus('RECORDING');
        startTimeRef.current = performance.now();

        timerIntervalRef.current = window.setInterval(() => {
          if (startTimeRef.current) {
            setElapsedTimeMs(performance.now() - startTimeRef.current);
          }
        }, 16);
      }
    } else if (status === 'RECORDING') {
      const hasBreached80 = speed >= 80;
      const maxSoFar = Math.max(...speedHistoryRef.current);
      const isRollOffDecay = maxSoFar > 40 && speed < maxSoFar - 12;

      if (hasBreached80 || isRollOffDecay) {
        const finalTime = startTimeRef.current ? (performance.now() - startTimeRef.current) / 1000 : 0;
        finishRun(finalTime, speed >= 80 ? 80 : maxSoFar);
      }
    }
  };

  const finishRun = (deltaSeconds: number, maxSpeed: number) => {
    if (timerIntervalRef.current !== null) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    setStatus('FINISHED');

    const deltaV = (maxSpeed - 25) * (1000 / 3600);
    const avgG = deltaSeconds > 0 ? Number(((deltaV / deltaSeconds) / 9.81).toFixed(2)) : 0;

    const newRun: GPSTestRun = {
      id: `run-${Date.now()}`,
      date: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      mode: '25-80',
      elapsedSeconds: Number(deltaSeconds.toFixed(3)),
      maxSpeedKmh: Math.round(maxSpeedReached || maxSpeed),
      avgAccelerationG: avgG,
      vehicleName: vehicleName || 'Sirius 110 Zin'
    };

    setLastFinishedRun(newRun);
    onSaveRun(newRun);
  };

  const handleSimulateThrottle = (targetThrottle: number) => {
    setSimThrottle(targetThrottle);
    const simulatedKmh = Number((targetThrottle * 1.1).toFixed(1));
    processSpeedInput(simulatedKmh);
  };

  const handleSimulateFullPull = () => {
    setStatus('ARMED');
    setElapsedTimeMs(0);
    setMaxSpeedReached(0);
    speedHistoryRef.current = [];

    let current = 0;
    const interval = setInterval(() => {
      current += 4.5;
      handleSimulateThrottle(Math.min(100, (current / 1.1)));
      if (current >= 82) {
        clearInterval(interval);
      }
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* KOSO Y2K DIGITAL LCD SPEEDOMETER DISPLAY - PURE BLACK & WHITE */}
      <div className="lcd-display rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,255,255,0.15)] relative overflow-hidden border-2 border-white">
        {/* Top telemetry bar */}
        <div className="flex justify-between items-center text-xs font-mono border-b border-white/30 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <GlowingStarIcon size={14} className={status === 'RECORDING' ? 'animate-bounce' : ''} />
            <span>
              STATUS: <strong className="text-white underline">{status}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>
              GPS SATELLITE: {gpsAccuracy ? `±${Math.round(gpsAccuracy)}m` : isSimulationMode ? 'WORKSHOP SIM' : 'SEARCHING...'}
            </span>
            <span className="hidden sm:inline">25-80 KM/H AUTO-ARM</span>
          </div>
        </div>

        {/* Center Digital Speed Readout */}
        <div className="flex flex-col items-center justify-center my-4 sm:my-6">
          <div className="text-7xl sm:text-9xl font-black font-tech tracking-tighter text-white text-center select-none white-glow-text leading-none">
            {Math.round(currentSpeedKmh).toString().padStart(2, '0')}
          </div>
          <div className="text-sm sm:text-base font-bold font-mono tracking-widest text-white mt-2">
            KILOMETERS PER HOUR (KM/H)
          </div>

          {/* Speed range progress bar */}
          <div className="w-full max-w-md h-3.5 bg-neutral-950 rounded-full mt-6 p-0.5 border border-white/40 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-100 shadow-[0_0_10px_rgba(255,255,255,0.6)]"
              style={{ width: `${Math.min(100, (currentSpeedKmh / 120) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between w-full max-w-md text-[10px] font-mono opacity-80 mt-1.5 text-white">
            <span>0</span>
            <span className="text-white font-bold underline">25 (TRIGGER)</span>
            <span>50</span>
            <span className="text-white font-bold underline">80 (FINISH)</span>
            <span>120+</span>
          </div>
        </div>

        {/* Stopwatch Chronometer Display */}
        <div className="mt-6 pt-4 border-t border-white/30 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
          <div>
            <span className="text-xs font-mono opacity-70 block">THỜI GIAN BẤM GIỜ TỰ ĐỘNG (25 → 80 KM/H):</span>
            <div className="text-3xl sm:text-4xl font-black font-tech text-white tracking-wider mt-0.5 white-glow-text">
              {(elapsedTimeMs / 1000).toFixed(3)} <span className="text-lg text-white/80">giây</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono opacity-70 block">TỐC ĐỘ CAO NHẤT ĐẠT ĐƯỢC:</span>
            <div className="text-2xl sm:text-3xl font-black font-tech text-white">
              {Math.round(maxSpeedReached)} <span className="text-sm">km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTION CONTROLS */}
      <div className="p-5 rounded-2xl bg-black border border-white/20 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h4 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
              <GlowingStarIcon size={16} />
              ĐIỀU KHIỂN ĐO GIA TỐC THỰC ĐỊA:
            </h4>
            <p className="text-xs text-white/60 font-mono mt-0.5">
              Hệ thống tự động kích hoạt bấm giờ khi xe vượt qua 25 km/h và dừng khi chạm 80 km/h.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulationMode(!isSimulationMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition cursor-pointer ${
                isSimulationMode ? 'bg-white text-black font-bold border-white' : 'bg-black text-white/60 border-white/30'
              }`}
            >
              Chế độ Xưởng (Demo)
            </button>
          </div>
        </div>

        {/* Primary Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {status === 'IDLE' || status === 'FINISHED' ? (
            <button
              onClick={startGPS}
              className="py-4 rounded-2xl bg-white text-black font-mono font-black text-sm hover:bg-neutral-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-98"
            >
              <Play className="w-5 h-5 fill-black text-black" />
              <span>SẴN SÀNG ĐO (ARM GPS TRIGGER)</span>
            </button>
          ) : (
            <button
              onClick={stopGPS}
              className="py-4 rounded-2xl bg-black hover:bg-neutral-900 text-white font-mono font-black text-sm border-2 border-white transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.4)] active:scale-98"
            >
              <Square className="w-5 h-5 fill-white text-white" />
              <span>DỪNG ĐO (CANCEL RUN)</span>
            </button>
          )}

          <button
            onClick={() => {
              setStatus('IDLE');
              setElapsedTimeMs(0);
              setMaxSpeedReached(0);
              setCurrentSpeedKmh(0);
            }}
            className="py-4 rounded-2xl bg-black hover:bg-neutral-900 text-white font-mono font-bold text-sm border border-white/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-white" />
            <span>RESET ĐỒNG HỒ</span>
          </button>
        </div>

        {/* WORKSHOP TEST MODE (Garage throttle slider) */}
        {isSimulationMode && (
          <div className="p-4 rounded-2xl bg-black border border-white/40 space-y-3 mt-4">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-white font-bold uppercase flex items-center gap-1.5">
                <GlowingStarIcon size={14} />
                GIẢ LẬP TAY GA TẠI XƯỞNG (WORKSHOP THROTTLE SIMULATOR):
              </span>
              <button
                onClick={handleSimulateFullPull}
                className="px-2.5 py-1 rounded-lg bg-white text-black font-bold text-[11px] hover:bg-neutral-200 cursor-pointer"
              >
                Mô phỏng 1 Cú Kéo Hết Ga (Auto Pull)
              </button>
            </div>
            <p className="text-[11px] text-white/70 font-mono">
              Kéo thanh trượt tay ga để thử thuật toán tự động nhận diện mốc 25 km/h và 80 km/h:
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-white/50">Nhả ga</span>
              <input
                type="range"
                min="0"
                max="100"
                value={simThrottle}
                onChange={(e) => handleSimulateThrottle(parseFloat(e.target.value))}
                className="w-full accent-white h-3 bg-neutral-900 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-white font-bold">Hết ga ({Math.round(simThrottle * 1.1)} km/h)</span>
            </div>
          </div>
        )}
      </div>

      {/* LAST RUN SUMMARY CARD */}
      {lastFinishedRun && (
        <div className="p-5 rounded-2xl bg-black border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.25)]">
          <div className="flex items-center gap-2 mb-2 text-white">
            <GlowingStarIcon size={18} />
            <h4 className="text-sm font-mono font-black uppercase">
              KẾT QUẢ ĐO GIA TỐC MỚI NHẤT:
            </h4>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center mt-3">
            <div className="bg-neutral-950 p-3 rounded-xl border border-white/20">
              <span className="text-[10px] text-white/50 block">THỜI GIAN 25-80</span>
              <span className="text-2xl font-black font-tech text-white white-glow-text">{lastFinishedRun.elapsedSeconds}s</span>
            </div>
            <div className="bg-neutral-950 p-3 rounded-xl border border-white/20">
              <span className="text-[10px] text-white/50 block">MAX SPEED</span>
              <span className="text-2xl font-black font-tech text-white">{lastFinishedRun.maxSpeedKmh} km/h</span>
            </div>
            <div className="bg-neutral-950 p-3 rounded-xl border border-white/20">
              <span className="text-[10px] text-white/50 block">G-FORCE TRUNG BÌNH</span>
              <span className="text-2xl font-black font-tech text-white">{lastFinishedRun.avgAccelerationG} G</span>
            </div>
            <div className="bg-neutral-950 p-3 rounded-xl border border-white/20">
              <span className="text-[10px] text-white/50 block">THỜI ĐIỂM</span>
              <span className="text-sm font-bold text-white/80 block mt-1">{lastFinishedRun.date}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
