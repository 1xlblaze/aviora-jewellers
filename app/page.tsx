import React from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, Sparkles, ShieldCheck, Droplets, RotateCcw, Truck, Gem, Eye } from 'lucide-react';
import { getProducts } from '@/lib/actions';
import { ArtisticImage } from '@/components/ui/artistic-image';
import { ProductCard } from '@/components/shop/product-card';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="relative w-full overflow-hidden bg-[#09090B]">
      {/* ========================================================================= */}
      {/* PRD MANDATORY TRUST MARQUEE: 14K GOLD BRANDING                            */}
      {/* ========================================================================= */}
      <div className="bg-[#D4AF37] text-zinc-950 py-2.5 px-6 overflow-hidden select-none font-mono text-xs tracking-[0.25em] uppercase font-bold flex justify-around items-center shadow-md">
        <span>✦ 100% WATERPROOF</span>
        <span className="hidden sm:inline">✦ CRAFTED IN 14K GOLD</span>
        <span>✦ LIFETIME ANTI-TARNISH</span>
        <span className="hidden sm:inline">✦ BIS 925 HALLMARKED</span>
      </div>

      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO SECTION                                                 */}
      {/* ========================================================================= */}
      <section className="relative h-[92vh] min-h-[660px] w-full flex flex-col justify-between p-6 md:p-14 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ArtisticImage
            src="/products/14k-gold-plated-double-layer-necklace-4200-1.jpg"
            alt="AVIORA 14K Fine Jewellery Hero"
            fill
            priority
            className="w-full h-full scale-105 animate-[pulse_14s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-black/30 to-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(230,202,151,0.12)_0%,transparent_60%)]" />
        </div>

        <div className="relative z-10 flex justify-between items-start text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="text-[#D4AF37]">14K CHAMPAGNE GOLD ATELIER</span>
          </div>
          <span className="hidden sm:inline text-zinc-500">
            MUMBAI • JAIPUR • PARIS
          </span>
        </div>

        <div className="relative z-10 max-w-5xl space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 border border-zinc-700/60 bg-black/40 backdrop-blur-md px-3.5 py-1 text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>THE 14K GOLD PARADOX: SOFTER HUE, HARDER ALLOY</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-zinc-100 tracking-tight leading-[0.92] uppercase font-normal">
            SCULPTED <br />
            <span className="font-serif italic font-light text-[#E5E5E5] tracking-normal">
              For Everyday.
            </span>
          </h1>

          <p className="max-w-xl text-xs sm:text-sm md:text-base font-mono text-zinc-400 leading-relaxed tracking-wide pt-2">
            Fine jewelry you never need to take off. We exclusively cast in 14K Champagne Gold because it is harder and more scratch-resistant than 18K/24K soft gold. Water-resistant, sweat-proof, and designed to be lived in.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-6">
            <Link
              href="/atelier"
              className="px-8 py-4 bg-[#D4AF37] hover:bg-[#c5a059] text-zinc-950 font-mono text-xs tracking-[0.25em] uppercase font-bold flex items-center gap-3 transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.25)] group"
            >
              <span>Explore The 14K Atelier</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
            </Link>

            <Link
              href="#curated-gallery"
              className="px-6 py-4 border border-zinc-700/80 hover:border-zinc-400 text-zinc-300 hover:text-white font-mono text-xs tracking-[0.2em] uppercase transition-colors"
            >
              View Curated Archive
            </Link>
          </div>
        </div>

        <div className="relative z-10 flex justify-between items-end border-t border-zinc-800/80 pt-6 text-[10px] font-mono tracking-widest text-zinc-500">
          <div className="flex items-center gap-8">
            <span className="text-[#D4AF37]">MUMBAI • DELHI • BENGALURU • JAIPUR</span>
            <span className="hidden md:inline">STARTING AT ₹3,299 // CASH ON DELIVERY AVAILABLE</span>
          </div>
          <a
            href="#curated-gallery"
            className="flex items-center gap-2 hover:text-zinc-200 transition-colors"
          >
            <span>VIEW CURATED PIECES</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PALMONAS-STYLE 4-PILLAR TRUST BAR                                      */}
      {/* ========================================================================= */}
      <section className="bg-[#0A0A0C] border-y border-zinc-800/80 py-8 px-6 md:px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-sky-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-zinc-200">100% Waterproof</h4>
              <p className="text-[10px] font-mono text-zinc-500">Wear in shower, pool & gym</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-zinc-200">14K Champagne Gold</h4>
              <p className="text-[10px] font-mono text-zinc-500">Scratch-resistant alloy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-emerald-400">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-zinc-200">BIS 925 Hallmarked</h4>
              <p className="text-[10px] font-mono text-zinc-500">Govt certified pure silver core</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center flex-shrink-0 text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-zinc-200">Free Express & COD</h4>
              <p className="text-[10px] font-mono text-zinc-500">Pan-India delivery in 2-4 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. ASYMMETRICAL CURATED GALLERY                                           */}
      {/* ========================================================================= */}
      <section
        id="curated-gallery"
        className="py-24 px-6 md:px-14 border-t border-zinc-900/80 bg-[#09090B]"
      >
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-8 gap-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#D4AF37] block mb-2">
                NEW 14K FESTIVE ARCHIVE
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-zinc-100 tracking-tight font-normal">
                Curated Gallery
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <p className="text-xs font-mono text-zinc-400 max-w-sm text-right hidden sm:block">
                Modern Indian jewelry designed for daily luxury in 14K champagne gold.
              </p>
              <Link
                href="/atelier"
                className="px-6 py-3 border border-zinc-700 hover:border-[#D4AF37] text-xs font-mono tracking-[0.2em] uppercase text-zinc-300 hover:text-[#D4AF37] transition-all"
              >
                View All Works ({products.length})
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="md:col-span-7 space-y-12">
              <div>
                <ProductCard product={products[0]} index={0} priority />
                <div className="mt-4 p-4 border border-zinc-800/60 bg-zinc-950/40 flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500 uppercase tracking-widest">
                    BESTSELLER: THE MOLTEN 14K KADA
                  </span>
                  <span className="text-[#D4AF37] font-semibold">14K GOLD VERMEIL // ₹4,899</span>
                </div>
              </div>

              <div className="md:w-5/6 ml-auto">
                <ProductCard product={products[2]} index={2} />
              </div>
            </div>

            <div className="md:col-span-5 space-y-16 pt-0 md:pt-16">
              <div>
                <ProductCard product={products[1]} index={1} />
                <p className="font-serif italic text-zinc-400 text-sm mt-3 px-2">
                  &ldquo;A 2-carat VVS1 moissanite suspended in 14K orbital gold. Pure fire and ethical luxury.&rdquo;
                </p>
              </div>

              <div className="md:w-11/12">
                <ProductCard product={products[3]} index={3} />
              </div>

              <div>
                <ProductCard product={products[4]} index={4} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
