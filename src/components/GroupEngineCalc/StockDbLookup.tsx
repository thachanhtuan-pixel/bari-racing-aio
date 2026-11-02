import React, { useState } from 'react';
import { MOTORCYCLE_DATABASE } from '../../data/motorcycle-db';
import { MotorcycleSpec } from '../../types';
import { Search } from 'lucide-react';
import { GlowingStarIcon } from '../GlowingStarIcon';

interface StockDbLookupProps {
  onSelectSpec?: (spec: MotorcycleSpec) => void;
}

export const StockDbLookup: React.FC<StockDbLookupProps> = ({ onSelectSpec }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('ALL');

  const filtered = MOTORCYCLE_DATABASE.filter(spec => {
    const matchesSearch = spec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          spec.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          spec.id.includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === 'ALL' || spec.manufacturer === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-black border border-white/20 flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-white/50 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo tên xe, bài độ, trái piston..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-white/30 focus:border-white rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-white outline-none"
          />
        </div>

        {/* Brand Filter */}
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {['ALL', 'Honda', 'Yamaha', 'Suzuki', 'Custom'].map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                selectedBrand === brand
                  ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                  : 'bg-black text-white/60 border-white/20 hover:text-white'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Motorcycle Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(spec => (
          <div
            key={spec.id}
            className="p-4 rounded-2xl bg-black border border-white/20 hover:border-white transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-white font-bold border border-white/40">
                    {spec.manufacturer}
                  </span>
                  <h4 className="text-base font-bold text-white font-display mt-1">
                    {spec.name}
                  </h4>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black font-tech text-white">
                    {spec.displacement} <span className="text-xs">cc</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">CR: {spec.cr}:1</span>
                </div>
              </div>

              <p className="text-xs text-white/70 font-mono mb-3 line-clamp-2">
                {spec.description}
              </p>

              {/* Specs Table */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-neutral-950 p-3 rounded-xl border border-white/15 mb-3">
                <div>
                  <span className="text-white/50">Trái x Dên: </span>
                  <strong className="text-white">{spec.bore} x {spec.stroke} mm</strong>
                </div>
                <div>
                  <span className="text-white/50">Ắc piston: </span>
                  <strong className="text-white">{spec.pin} mm</strong>
                </div>
                <div>
                  <span className="text-white/50">Bình xăng/họng: </span>
                  <strong className="text-white">{spec.carbZin} mm</strong>
                </div>
                <div>
                  <span className="text-white/50">NSD Zin: </span>
                  <strong className="text-white">{spec.nsd}</strong>
                </div>
                <div className="col-span-2 pt-1 border-t border-white/10">
                  <span className="text-white/50">Khe hở súp bắp In/Ex: </span>
                  <strong className="text-white">{spec.valveClearanceIn} / {spec.valveClearanceEx} mm</strong>
                </div>
              </div>
            </div>

            {onSelectSpec && (
              <button
                onClick={() => onSelectSpec(spec)}
                className="w-full py-2.5 rounded-xl bg-black hover:bg-white text-white hover:text-black font-mono font-bold text-xs border border-white/40 hover:border-white transition flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_8px_rgba(255,255,255,0.15)]"
              >
                <GlowingStarIcon size={12} />
                <span>NẠP VÀO BỘ TÍNH</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
