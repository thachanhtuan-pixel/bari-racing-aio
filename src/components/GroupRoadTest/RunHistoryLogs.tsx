import React from 'react';
import { GPSTestRun } from '../../types';
import { Trash2 } from 'lucide-react';
import { GlowingStarIcon } from '../GlowingStarIcon';

interface RunHistoryLogsProps {
  runs: GPSTestRun[];
  onClearLogs: () => void;
}

export const RunHistoryLogs: React.FC<RunHistoryLogsProps> = ({ runs, onClearLogs }) => {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-black border border-white/20 flex justify-between items-center">
        <div>
          <h4 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
            <GlowingStarIcon size={16} />
            NHẬT KÝ CHẠY THỬ & ĐỐI CHIẾU GIA TỐC ({runs.length})
          </h4>
          <p className="text-xs text-white/60 font-mono mt-0.5">
            Lưu lại thời gian các lần chạy để đánh giá hiệu quả sau mỗi lần canh chỉnh xăng/lửa/nồi
          </p>
        </div>

        {runs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-neutral-900 border border-white/40 text-xs font-mono text-white cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-white" />
            <span>XÓA HẾT</span>
          </button>
        )}
      </div>

      {runs.length === 0 ? (
        <div className="p-10 rounded-2xl bg-black border border-white/15 text-center font-mono">
          <GlowingStarIcon size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm text-white/70">Chưa có dữ liệu lượt chạy nào.</p>
          <p className="text-xs text-white/40 mt-1">
            Bật GPS ở màn hình trước và kéo xe qua mốc 25 km/h để hệ thống tự động ghi nhật ký.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {runs.map((run, idx) => {
            const prevRun = runs[idx + 1];
            const deltaSec = prevRun ? Number((run.elapsedSeconds - prevRun.elapsedSeconds).toFixed(3)) : null;

            return (
              <div
                key={run.id}
                className="p-4 rounded-2xl bg-black border border-white/20 hover:border-white transition flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-mono"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <GlowingStarIcon size={12} />
                    <span className="text-xs font-bold text-white">#{runs.length - idx}</span>
                    <span className="text-xs text-white font-bold">{run.vehicleName}</span>
                    <span className="text-[10px] text-white/50">• {run.date}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 text-white/70 border border-white/20">Mốc: 25-80 km/h</span>
                  </div>

                  {deltaSec !== null && (
                    <div className="flex items-center gap-1.5 text-xs mt-1.5">
                      <GlowingStarIcon size={10} />
                      {deltaSec < 0 ? (
                        <span className="text-white font-bold underline">
                          Nhanh hơn lần trước {Math.abs(deltaSec)}s (Cải thiện gia tốc)
                        </span>
                      ) : (
                        <span className="text-white/70">
                          Chậm hơn lần trước +{deltaSec}s
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <span className="text-[10px] text-white/50 block">G-FORCE</span>
                    <span className="text-sm font-bold text-white">{run.avgAccelerationG} G</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-white/50 block">TỐC ĐỘ MAX</span>
                    <span className="text-sm font-bold text-white">{run.maxSpeedKmh} km/h</span>
                  </div>

                  <div className="bg-neutral-950 px-3.5 py-2 rounded-xl border border-white/40">
                    <span className="text-[10px] text-white/50 block">THỜI GIAN</span>
                    <span className="text-lg font-black font-tech text-white white-glow-text">
                      {run.elapsedSeconds}s
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
