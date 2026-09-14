'use client';

import React from 'react';
import { CATEGORIES, METAL_SWATCHES, OCCASION_VIBES, type OccasionVibe } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { Sparkles, Sliders } from 'lucide-react';

interface FilterSidebarProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  selectedColorTone: string;
  onSelectColorTone: (color: string) => void;
  selectedVibe: OccasionVibe;
  onSelectVibe: (vibe: OccasionVibe) => void;
  maxPrice: number;
  onMaxPriceChange: (val: number) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalCount: number;
  onResetFilters: () => void;
}

export function FilterSidebar({
  selectedCategory,
  onSelectCategory,
  selectedColorTone,
  onSelectColorTone,
  selectedVibe,
  onSelectVibe,
  maxPrice,
  onMaxPriceChange,
  searchQuery,
  onSearchChange,
  totalCount,
  onResetFilters,
}: FilterSidebarProps) {
  return (
    <aside className="w-full lg:w-72 space-y-9 pr-0 lg:pr-8 border-b lg:border-b-0 lg:border-r border-zinc-800/60 pb-8 lg:pb-0 select-none">
      {/* Search Bar */}
      <div className="space-y-2.5">
        <label className="block text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400">
          Index Search
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search kada, 14K, moissanite..."
            className="w-full bg-[#0A0A0C] border border-zinc-800 focus:border-[#D4AF37] px-3.5 py-2.5 text-xs font-mono text-zinc-100 placeholder-zinc-600 outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300 font-mono"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 1. Visual Metal Swatches (PRD Requirement A) */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400">
            Metal Swatch
          </span>
          {selectedColorTone && (
            <button
              onClick={() => onSelectColorTone('')}
              className="text-[9px] font-mono text-[#D4AF37] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 pt-1">
          {METAL_SWATCHES.map((swatch) => {
            const isSelected = selectedColorTone === swatch.name;
            return (
              <button
                key={swatch.name}
                onClick={() => onSelectColorTone(isSelected ? '' : swatch.name)}
                className="group relative flex flex-col items-center gap-1.5 focus:outline-none"
                title={swatch.name}
              >
                <div
                  className={`w-7 h-7 rounded-full transition-all duration-300 shadow-md ${
                    isSelected
                      ? `ring-2 ring-offset-2 ring-offset-[#09090B] ring-[#D4AF37] scale-110`
                      : `hover:scale-105 border border-zinc-700`
                  }`}
                  style={{
                    backgroundColor: swatch.hex,
                    boxShadow: isSelected ? '0 0 12px rgba(230,202,151,0.5)' : undefined,
                  }}
                />
                <span className="text-[8px] font-mono text-zinc-400 tracking-wider max-w-[56px] text-center leading-tight">
                  {swatch.name.replace('14K ', '')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Occasion & Vibe Filters (PRD Requirement A) */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400">
            Occasion & Vibe
          </span>
          <span className="text-[9px] font-mono text-zinc-600">Aesthetic Mood</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {OCCASION_VIBES.map((vibe) => {
            const isSelected = selectedVibe === vibe;
            return (
              <button
                key={vibe}
                onClick={() => onSelectVibe(vibe)}
                className={`text-[10px] font-mono tracking-wider px-3 py-1.5 transition-all border ${
                  isSelected
                    ? 'border-[#D4AF37] text-zinc-950 bg-[#D4AF37] font-bold shadow-[0_0_12px_rgba(212,175,55,0.25)]'
                    : 'border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 bg-zinc-900/30'
                }`}
              >
                {vibe}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Dual-Handle Price Range Slider (PRD Requirement A) */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#D4AF37]" />
            Price Ceiling
          </span>
          <span className="font-mono text-xs text-[#D4AF37] font-bold">
            Up to {formatPrice(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={3000}
          max={10000}
          step={500}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="w-full accent-[#D4AF37] bg-zinc-800 cursor-pointer h-1.5 rounded-lg"
        />
        <div className="flex justify-between text-[9px] font-mono text-zinc-600">
          <span>₹3,000</span>
          <span>₹6,500</span>
          <span>₹10,000</span>
        </div>
      </div>

      {/* 4. Discipline (Categories) */}
      <div className="space-y-3 pt-2 border-t border-zinc-900">
        <div className="flex justify-between items-baseline">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400">
            Discipline
          </span>
          <span className="text-[9px] font-mono text-zinc-500">({totalCount} Pieces)</span>
        </div>
        <ul className="space-y-1.5 text-xs font-mono">
          <li>
            <button
              onClick={() => onSelectCategory('all')}
              className={`w-full text-left py-1.5 px-2.5 flex justify-between items-center transition-colors ${
                selectedCategory === 'all'
                  ? 'text-[#D4AF37] bg-zinc-900/80 font-bold border-l-2 border-[#D4AF37]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>All Collections</span>
              {selectedCategory === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
            </button>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full text-left py-1.5 px-2.5 flex justify-between items-center transition-colors ${
                  selectedCategory === cat.slug
                    ? 'text-[#D4AF37] bg-zinc-900/80 font-bold border-l-2 border-[#D4AF37]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{cat.name}</span>
                {selectedCategory === cat.slug && <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 14K Gold Guarantee Callout */}
      <div className="p-4 bg-gradient-to-br from-zinc-900/60 to-[#0A0A0C] border border-[#D4AF37]/30 text-zinc-400 text-[10px] font-mono leading-relaxed space-y-1.5">
        <div className="flex items-center gap-1.5 text-[#D4AF37] font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>14K CHAMPAGNE GOLD</span>
        </div>
        <p>
          Formulated to outlast 18K/24K soft gold in daily scratch resistance. 100% waterproof & sweat-proof with free lifetime replating.
        </p>
      </div>

      <button
        onClick={onResetFilters}
        className="w-full py-2 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white text-[10px] font-mono tracking-widest uppercase transition-colors"
      >
        Reset All Filters
      </button>
    </aside>
  );
}

export default FilterSidebar;
