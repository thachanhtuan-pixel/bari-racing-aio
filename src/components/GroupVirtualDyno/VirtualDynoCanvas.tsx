import React, { useRef, useEffect, useState } from 'react';
import { DynoResult, DynoCurvePoint } from '../../types';
import { GlowingStarIcon } from '../GlowingStarIcon';

interface VirtualDynoCanvasProps {
  dynoResult: DynoResult;
  stockResult?: DynoResult;
  showStockComparison: boolean;
}

export const VirtualDynoCanvas: React.FC<VirtualDynoCanvasProps> = ({
  dynoResult,
  stockResult,
  showStockComparison
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<DynoCurvePoint | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const margin = { top: 35, right: 45, bottom: 45, left: 45 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    // Pure Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const minRpm = 2000;
    const maxRpm = 12000;
    const redlineRpm = 10000;
    const redlineX = margin.left + ((redlineRpm - minRpm) / (maxRpm - minRpm)) * plotWidth;

    // Redline background zone (> 10000 RPM) - Monochrome striped / shaded
    const redlineGrad = ctx.createLinearGradient(redlineX, 0, width - margin.right, 0);
    redlineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
    redlineGrad.addColorStop(1, 'rgba(255, 255, 255, 0.12)');
    ctx.fillStyle = redlineGrad;
    ctx.fillRect(redlineX, margin.top, width - margin.right - redlineX, plotHeight);

    const maxHp = Math.max(30, Math.ceil(dynoResult.peakHp * 1.25));
    const maxTorque = Math.max(25, Math.ceil(dynoResult.maxTorque * 1.25));

    // Grid lines & labels
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1;
    ctx.font = '10px "Share Tech Mono", monospace';

    // Horizontal grid
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const y = margin.top + (plotHeight / ySteps) * i;
      ctx.beginPath();
      ctx.moveTo(margin.left, y);
      ctx.lineTo(width - margin.right, y);
      ctx.stroke();

      const hpVal = Math.round(maxHp * (1 - i / ySteps));
      const tqVal = Math.round(maxTorque * (1 - i / ySteps));

      // Left axis (HP)
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'right';
      ctx.fillText(`${hpVal}`, margin.left - 6, y + 3);

      // Right axis (Torque Nm)
      ctx.fillStyle = '#aaaaaa';
      ctx.textAlign = 'left';
      ctx.fillText(`${tqVal}`, width - margin.right + 6, y + 3);
    }

    // Vertical grid (RPM)
    for (let rpm = 2000; rpm <= 12000; rpm += 2000) {
      const x = margin.left + ((rpm - minRpm) / (maxRpm - minRpm)) * plotWidth;
      ctx.beginPath();
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, height - margin.bottom);
      ctx.strokeStyle = rpm === redlineRpm ? '#ffffff55' : '#222222';
      ctx.stroke();

      ctx.fillStyle = rpm >= redlineRpm ? '#ffffff' : '#888888';
      ctx.textAlign = 'center';
      ctx.fillText(`${rpm / 1000}k`, x, height - margin.bottom + 16);
    }

    const getX = (rpm: number) => margin.left + ((rpm - minRpm) / (maxRpm - minRpm)) * plotWidth;
    const getYHp = (hp: number) => margin.top + (1 - hp / maxHp) * plotHeight;
    const getYTorque = (torque: number) => margin.top + (1 - torque / maxTorque) * plotHeight;

    // Draw Stock Curves if enabled (Faint dashed lines)
    if (showStockComparison && stockResult) {
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.5;
      stockResult.curve.forEach((p, idx) => {
        const x = getX(p.rpm);
        const y = getYHp(p.hp);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(180, 180, 180, 0.3)';
      stockResult.curve.forEach((p, idx) => {
        const x = getX(p.rpm);
        const y = getYTorque(p.torque);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Tuned Torque Curve (Crisp Silver/Gray with dash pattern)
    ctx.beginPath();
    ctx.setLineDash([6, 3]);
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2.5;
    dynoResult.curve.forEach((p, idx) => {
      const x = getX(p.rpm);
      const y = getYTorque(p.torque);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Tuned HP Curve with Radiant White Glow
    ctx.save();
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    dynoResult.curve.forEach((p, idx) => {
      const x = getX(p.rpm);
      const y = getYHp(p.hp);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // Peak Markers (Solid White stars / circles)
    const peakHpX = getX(dynoResult.peakHpRpm);
    const peakHpY = getYHp(dynoResult.peakHp);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(peakHpX, peakHpY, 5, 0, Math.PI * 2);
    ctx.fill();

    const peakTqX = getX(dynoResult.maxTorqueRpm);
    const peakTqY = getYTorque(dynoResult.maxTorque);
    ctx.fillStyle = '#aaaaaa';
    ctx.beginPath();
    ctx.arc(peakTqX, peakTqY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Axis Labels
    ctx.font = 'bold 11px "Share Tech Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.fillText('HORSEPOWER (HP) — ĐƯỜNG LIỀN TRẮNG', margin.left, 20);

    ctx.fillStyle = '#aaaaaa';
    ctx.textAlign = 'right';
    ctx.fillText('TORQUE (Nm) — ĐƯỜNG ĐỨT', width - margin.right, 20);

    ctx.fillStyle = '#888888';
    ctx.textAlign = 'center';
    ctx.fillText('ENGINE REVOLUTIONS PER MINUTE (RPM)', width / 2, height - 10);

  }, [dynoResult, stockResult, showStockComparison]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const margin = { left: 45, right: 45 };
    const plotWidth = rect.width - margin.left - margin.right;
    const minRpm = 2000;
    const maxRpm = 12000;

    const rpmRatio = (x - margin.left) / plotWidth;
    if (rpmRatio >= 0 && rpmRatio <= 1) {
      const targetRpm = minRpm + rpmRatio * (maxRpm - minRpm);
      let nearest = dynoResult.curve[0];
      let minDiff = Infinity;
      dynoResult.curve.forEach(pt => {
        const diff = Math.abs(pt.rpm - targetRpm);
        if (diff < minDiff) {
          minDiff = diff;
          nearest = pt;
        }
      });
      setHoveredPoint(nearest);
    } else {
      setHoveredPoint(null);
    }
  };

  return (
    <div className="relative rounded-2xl bg-black border border-white/20 p-2 sm:p-4 shadow-2xl overflow-hidden">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredPoint(null)}
        className="w-full h-64 sm:h-80 cursor-crosshair block"
      />

      {/* Floating Hover Indicator */}
      {hoveredPoint && (
        <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md border border-white/60 rounded-xl p-3 shadow-2xl font-mono text-xs pointer-events-none">
          <div className="text-white font-bold border-b border-white/20 pb-1 mb-1.5 flex items-center gap-1.5">
            <GlowingStarIcon size={12} />
            <span>{hoveredPoint.rpm} RPM</span>
          </div>
          <div className="text-white flex justify-between gap-4">
            <span>Công suất:</span>
            <span className="font-bold">{hoveredPoint.hp} HP</span>
          </div>
          <div className="text-white/70 flex justify-between gap-4">
            <span>Momen xoắn:</span>
            <span className="font-bold">{hoveredPoint.torque} Nm</span>
          </div>
        </div>
      )}
    </div>
  );
};
