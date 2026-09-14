'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { PRODUCTS, type OccasionVibe } from '@/lib/data';
import { ProductCard } from '@/components/shop/product-card';
import { FilterSidebar } from '@/components/shop/filter-sidebar';

export default function AtelierPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedColorTone, setSelectedColorTone] = useState<string>('');
  const [selectedVibe, setSelectedVibe] = useState<OccasionVibe>('All Vibes');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter Logic with visual swatches & occasion vibes (PRD Requirement A)
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.categorySlug === selectedCategory);
    }

    if (selectedColorTone) {
      list = list.filter(
        (p) =>
          p.colorTone.toLowerCase().includes(selectedColorTone.toLowerCase()) ||
          p.material.toLowerCase().includes(selectedColorTone.toLowerCase())
      );
    }

    if (selectedVibe !== 'All Vibes') {
      list = list.filter((p) => p.occasionVibe === selectedVibe);
    }

    list = list.filter((p) => p.price <= maxPrice);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategory, selectedColorTone, selectedVibe, maxPrice, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedColorTone('');
    setSelectedVibe('All Vibes');
    setMaxPrice(10000);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Page Header */}
        <div className="border-b border-zinc-800 pb-10 space-y-4">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-[0.35em] uppercase text-zinc-500">
            <span>14K CHAMPAGNE GOLD CATALOG</span>
            <span className="text-[#D4AF37]">BIS 925 CERTIFIED</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-zinc-100 uppercase">
                The Atelier
              </h1>
              <p className="font-serif italic text-zinc-400 text-lg sm:text-xl mt-1">
                Permanent catalogue of 14K champagne gold and hallmarked silver sculptures.
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="flex items-center gap-4 lg:hidden">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs font-mono tracking-wider uppercase text-zinc-300"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <span>Filters ({filteredProducts.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Layout: Filter Sidebar + Raw Artwork Grid */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block sticky top-28">
            <FilterSidebar
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedColorTone={selectedColorTone}
              onSelectColorTone={setSelectedColorTone}
              selectedVibe={selectedVibe}
              onSelectVibe={setSelectedVibe}
              maxPrice={maxPrice}
              onMaxPriceChange={setMaxPrice}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              totalCount={filteredProducts.length}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full lg:hidden bg-[#0A0A0C] border border-zinc-800 p-6 space-y-6"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#D4AF37]">
                    Filter Archive
                  </span>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar
                  selectedCategory={selectedCategory}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    setMobileFilterOpen(false);
                  }}
                  selectedColorTone={selectedColorTone}
                  onSelectColorTone={(col) => {
                    setSelectedColorTone(col);
                    setMobileFilterOpen(false);
                  }}
                  selectedVibe={selectedVibe}
                  onSelectVibe={(v) => {
                    setSelectedVibe(v);
                    setMobileFilterOpen(false);
                  }}
                  maxPrice={maxPrice}
                  onMaxPriceChange={setMaxPrice}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  totalCount={filteredProducts.length}
                  onResetFilters={handleResetFilters}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Raw Artwork Grid */}
          <div className="flex-1 w-full">
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center border border-dashed border-zinc-800 p-12 space-y-4">
                <p className="font-serif italic text-2xl text-zinc-400">
                  No sculptural pieces match your archival criteria.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-6 py-2.5 text-xs font-mono tracking-[0.2em] uppercase border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-zinc-950 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
                {filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={idx}
                    priority={idx < 3}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
