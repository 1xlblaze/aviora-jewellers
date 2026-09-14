'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronDown,
  ShieldCheck,
  Truck,
  Sparkles,
  Share2,
  Check,
  PackageCheck,
  MapPin,
  RotateCcw,
  Droplets,
  Play,
  User,
  Eye,
  Type,
  AlertCircle,
} from 'lucide-react';
import {
  PRODUCTS,
  COLLECTOR_TESTIMONIALS,
  WHY_14K_GOLD_COPY,
  type Product,
} from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { ArtisticImage } from '@/components/ui/artistic-image';
import { useCart } from '@/lib/cart-context';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const product = PRODUCTS.find((p) => p.slug === slug);
  const { addToCart } = useCart();

  const [activeAccordion, setActiveAccordion] = useState<string | null>('why-14k');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  // PRD Requirement: "View on Model" vs "View Product Only" toggle
  const [viewMode, setViewMode] = useState<'product' | 'model'>('product');

  // PRD Requirement: Complimentary Archival Engraving
  const [addEngraving, setAddEngraving] = useState(false);
  const [engravingText, setEngravingText] = useState('');

  // Indian Pincode Delivery Checker State
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <p className="font-serif italic text-3xl text-zinc-400 mb-4">
          Archival piece not found.
        </p>
        <Link
          href="/atelier"
          className="px-6 py-3 border border-[#D4AF37] text-xs font-mono tracking-widest text-[#D4AF37] uppercase"
        >
          Return to Atelier
        </Link>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeResult(
        `✓ Delivery to ${pincode} in 2-3 business days via Blue Dart Express. COD Available.`
      );
    } else {
      setPincodeResult('Please enter a valid 6-digit Indian PIN code.');
    }
  };

  const toggleAccordion = (key: string) => {
    setActiveAccordion(activeAccordion === key ? null : key);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddPiece = () => {
    addToCart(product, selectedQuantity);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      {/* Back to Archive Breadcrumb */}
      <div className="border-b border-zinc-800/80 px-6 md:px-14 py-3.5 flex items-center justify-between text-xs font-mono tracking-widest uppercase text-zinc-400">
        <Link
          href="/atelier"
          className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Atelier Collection</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-[#D4AF37] hidden sm:inline">
            ✦ CRAFTED IN 14K CHAMPAGNE GOLD
          </span>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Piece</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main PDP Grid: Left Full-Viewport Stacked Images, Right Sticky Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* ===================================================================== */}
        {/* LEFT COLUMN: CINEMATIC GALLERY WITH MODEL TOGGLE                      */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-4 lg:space-y-6 p-4 md:p-10 border-b lg:border-b-0 lg:border-r border-zinc-800/60">
          {/* Floating Gallery Controls: Model Scaling */}
          <div className="sticky top-24 z-30 flex items-center justify-between bg-black/70 backdrop-blur-md p-2.5 border border-zinc-800 text-xs font-mono">
            {/* View on Model vs View Product Only */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewMode('product')}
                className={`px-3 py-1.5 uppercase tracking-wider text-[10px] transition-all flex items-center gap-1.5 ${
                  viewMode === 'product'
                    ? 'bg-[#D4AF37] text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Product Only</span>
              </button>
              <button
                onClick={() => setViewMode('model')}
                className={`px-3 py-1.5 uppercase tracking-wider text-[10px] transition-all flex items-center gap-1.5 ${
                  viewMode === 'model'
                    ? 'bg-[#D4AF37] text-zinc-950 font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>View on Model (Scale)</span>
              </button>
            </div>

            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
              14K STUDIO CAPTURE
            </span>
          </div>

          {/* Render Mode: If Model Mode is Active */}
          {viewMode === 'model' ? (
            <div className="relative w-full min-h-[75vh] lg:min-h-[92vh] bg-[#0A0A0D] overflow-hidden border border-[#D4AF37]/40 group animate-fadeIn">
              <div className="absolute top-6 left-6 z-20 pointer-events-none">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-300 bg-black/80 backdrop-blur-md px-3 py-1 border border-[#D4AF37]/50 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-[#D4AF37]" />
                  RELATIVE SIZE & MODEL PROPORTION
                </span>
              </div>
              <ArtisticImage
                src={product.modelImage}
                alt={`${product.name} on Model`}
                fill
                priority
                className="w-full h-full"
                exhibitNumber="SCALE // MODEL"
                materialTag="14K CHAMPAGNE GOLD"
              />
            </div>
          ) : (
            <>
              {/* Plate 1: Main Product Shot */}
              <div className="relative w-full min-h-[70vh] lg:min-h-[92vh] bg-[#0A0A0D] overflow-hidden border border-zinc-800/80 group">
                <div className="absolute top-6 left-6 z-20 pointer-events-none">
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-300 bg-black/70 backdrop-blur-md px-3 py-1 border border-zinc-800">
                    PLATE // 01 (STUDIO MACRO)
                  </span>
                </div>
                <ArtisticImage
                  src={product.images[0]}
                  alt={`${product.name} Plate 1`}
                  fill
                  priority
                  className="w-full h-full"
                  exhibitNumber="PLATE // 01"
                  materialTag={product.material}
                />
              </div>

              {/* Plate 2: Video Shimmer Demonstration (PRD Requirement: Video First) */}
              <div className="relative w-full min-h-[60vh] lg:min-h-[85vh] bg-[#0A0A0D] overflow-hidden border border-zinc-800/80 group">
                <div className="absolute top-6 left-6 z-20 pointer-events-none flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-300 bg-black/80 backdrop-blur-md px-3 py-1 border border-[#D4AF37]/50 flex items-center gap-1.5">
                    <Play className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                    SLOW-MOTION LIGHT REFLECTION LOOP
                  </span>
                </div>
                {/* Looping video representation */}
                <ArtisticImage
                  src={product.images[1] || product.images[0]}
                  alt={`${product.name} Light Loop`}
                  fill
                  className="w-full h-full animate-[pulse_8s_ease-in-out_infinite]"
                  exhibitNumber="VIDEO // LOOP"
                  materialTag="14K LUSTRE CAPTURE"
                />
                <div className="absolute bottom-6 right-6 z-20 bg-black/70 backdrop-blur-md px-3 py-1 text-[9px] font-mono text-zinc-400 border border-zinc-800">
                  <span>14K CHAMPAGNE REFRACTION</span>
                </div>
              </div>

              {/* Plate 3: Additional Macro Angles */}
              {product.images.slice(2).map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="relative w-full min-h-[70vh] lg:min-h-[92vh] bg-[#0A0A0D] overflow-hidden border border-zinc-800/80 group"
                >
                  <div className="absolute top-6 left-6 z-20 pointer-events-none">
                    <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-300 bg-black/70 backdrop-blur-md px-3 py-1 border border-zinc-800">
                      PLATE // 0{idx + 3} (ARTISAN DETAIL)
                    </span>
                  </div>
                  <ArtisticImage
                    src={imgUrl}
                    alt={`${product.name} Plate ${idx + 3}`}
                    fill
                    className="w-full h-full"
                    exhibitNumber={`PLATE // 0${idx + 3}`}
                    materialTag={product.material}
                  />
                </div>
              ))}
            </>
          )}
        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN: STICKY PRODUCT INFO DOSSIER                              */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 p-6 md:p-12 lg:p-16 flex flex-col justify-start">
          <div className="lg:sticky lg:top-28 space-y-7">
            {/* Header Metadata */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37]">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {product.goldPurity} // {product.colorTone}
                </span>
                <span className="text-zinc-500">{product.hallmark}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl text-zinc-100 font-normal tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Pricing in INR */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-mono text-3xl text-zinc-100 font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-base text-zinc-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {discount && (
                  <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-mono font-semibold">
                    SAVE {discount}%
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-zinc-400">
                Includes 3% GST · Certified BIS Hallmarking · Free Pan-India Express Delivery
              </p>
            </div>

            {/* PRD Low Stock Scarcity Trigger (< 3 inventory) */}
            {product.inventory < 3 && (
              <div className="p-3 bg-amber-950/30 border border-amber-800/80 flex items-center justify-between text-xs font-mono text-amber-300">
                <span className="flex items-center gap-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Archival piece: Only {product.inventory} left in stock.
                </span>
                <span className="text-[9px] uppercase tracking-wider text-amber-500">
                  High Demand
                </span>
              </div>
            )}

            {/* 3-Badge Trust Pill */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-zinc-950 border border-zinc-800/80 text-center">
              <div className="space-y-1 p-2">
                <Droplets className="w-4 h-4 text-sky-400 mx-auto" />
                <span className="text-[10px] font-mono text-zinc-300 block font-semibold leading-tight">
                  100% Waterproof
                </span>
                <span className="text-[8px] font-mono text-zinc-500 block">Shower & Gym Safe</span>
              </div>
              <div className="space-y-1 p-2 border-x border-zinc-900">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] mx-auto" />
                <span className="text-[10px] font-mono text-zinc-300 block font-semibold leading-tight">
                  14K Champagne Gold
                </span>
                <span className="text-[8px] font-mono text-zinc-500 block">Scratch-Proof Alloy</span>
              </div>
              <div className="space-y-1 p-2">
                <Sparkles className="w-4 h-4 text-emerald-400 mx-auto" />
                <span className="text-[10px] font-mono text-zinc-300 block font-semibold leading-tight">
                  BIS 925 Hallmarked
                </span>
                <span className="text-[8px] font-mono text-zinc-500 block">Lifetime Warranty</span>
              </div>
            </div>

            {/* PRD Customization: Complimentary Archival Engraving */}
            {product.isEngravable && (
              <div className="p-4 bg-[#0D0D10] border border-zinc-800 space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-mono text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={addEngraving}
                    onChange={(e) => setAddEngraving(e.target.checked)}
                    className="accent-[#D4AF37] w-4 h-4"
                  />
                  <span className="font-semibold text-[#D4AF37] flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5" /> Add Complimentary Archival Engraving (Free)
                  </span>
                </label>
                {addEngraving && (
                  <div className="space-y-1 pt-1 animate-fadeIn">
                    <input
                      type="text"
                      maxLength={4}
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                      placeholder="ENTER INITIALS (MAX 4 LETTERS, e.g. 'AS')"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] px-3.5 py-2 text-xs font-mono text-zinc-100 uppercase tracking-widest outline-none"
                    />
                    <p className="text-[9px] font-mono text-zinc-500">
                      Hand-engraved by our master calligrapher in Mumbai prior to dispatch.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Indian Pincode Delivery Checker */}
            <div className="p-4 bg-[#0D0D10] border border-zinc-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Check Express Delivery & COD by PIN Code</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit PIN (e.g. 400001)"
                  className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] px-3 py-2 text-xs font-mono text-zinc-100 placeholder-zinc-600 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-800 hover:bg-[#D4AF37] hover:text-zinc-950 text-zinc-200 text-xs font-mono uppercase tracking-wider font-semibold transition-colors"
                >
                  Check
                </button>
              </form>
              {pincodeResult && (
                <p
                  className={`text-[11px] font-mono mt-1.5 ${
                    pincodeResult.includes('✓') ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {pincodeResult}
                </p>
              )}
            </div>

            {/* Action Bar */}
            <div className="space-y-4 pt-1">
              <div className="flex gap-4">
                <div className="flex items-center border border-zinc-800 bg-zinc-900/60 text-xs font-mono px-3">
                  <button
                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                    className="py-2 px-2 text-zinc-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 text-zinc-200 font-bold">{selectedQuantity}</span>
                  <button
                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                    className="py-2 px-2 text-zinc-400 hover:text-white"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddPiece}
                  className="flex-1 py-4 bg-[#D4AF37] hover:bg-[#c5a059] text-zinc-950 font-mono text-xs tracking-[0.25em] uppercase font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_25px_rgba(212,175,55,0.25)]"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Add to Bag ({formatPrice(product.price * selectedQuantity)})</span>
                </button>
              </div>

              <div className="space-y-1.5 text-[10px] font-mono text-zinc-400">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Check className="w-3.5 h-3.5" /> Cash on Delivery (COD) Available
                  </span>
                  <span className="text-zinc-500">Extra 5% off on UPI</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" /> Easy 30-Day Returns & Exchanges
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Free Pan-India Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Accordion Dossier */}
            <div className="border-t border-zinc-800 divide-y divide-zinc-900 pt-2 text-xs font-mono">
              {/* PRD MANDATORY ACCORDION: Why We Cast in 14K Gold */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('why-14k')}
                  className="w-full flex justify-between items-center text-left text-zinc-100 hover:text-[#D4AF37] transition-colors"
                >
                  <span className="tracking-[0.2em] uppercase font-bold text-[#D4AF37] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Why We Cast in 14K Gold
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeAccordion === 'why-14k' ? 'rotate-180 text-[#D4AF37]' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'why-14k' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden text-zinc-300 pt-3 space-y-3 leading-relaxed"
                    >
                      <p className="font-serif italic text-sm text-zinc-200 border-l-2 border-[#D4AF37] pl-3 py-1">
                        &ldquo;{WHY_14K_GOLD_COPY.body}&rdquo;
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        {WHY_14K_GOLD_COPY.pillars.map((pil) => (
                          <div key={pil.label} className="p-2.5 bg-zinc-950 border border-zinc-800">
                            <span className="text-[10px] font-mono text-[#D4AF37] block font-bold">
                              {pil.label}
                            </span>
                            <span className="text-[9px] font-mono text-zinc-400 block mt-0.5">
                              {pil.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Materiality */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('materiality')}
                  className="w-full flex justify-between items-center text-left text-zinc-200 hover:text-[#D4AF37] transition-colors"
                >
                  <span className="tracking-[0.2em] uppercase">Materiality & Provenance</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeAccordion === 'materiality' ? 'rotate-180 text-[#D4AF37]' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'materiality' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden text-zinc-400 pt-3 space-y-2 leading-relaxed"
                    >
                      <p>
                        <strong className="text-zinc-200">Alloy:</strong> {product.material}
                      </p>
                      <p>
                        <strong className="text-zinc-200">Weight:</strong> {product.weight}
                      </p>
                      <p>
                        <strong className="text-zinc-200">Occasion Vibe:</strong> {product.occasionVibe}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dimensions */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('dimensions')}
                  className="w-full flex justify-between items-center text-left text-zinc-200 hover:text-[#D4AF37] transition-colors"
                >
                  <span className="tracking-[0.2em] uppercase">Dimensions & Anatomical Fit</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      activeAccordion === 'dimensions' ? 'rotate-180 text-[#D4AF37]' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === 'dimensions' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden text-zinc-400 pt-3 space-y-2 leading-relaxed"
                    >
                      <p>{product.dimensions}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ELEVATED SOCIAL PROOF: "IN THE WILD" (COLLECTOR TESTIMONIALS)             */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 md:px-14 border-t border-zinc-900 bg-[#070709]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-800 pb-6 gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#D4AF37] block">
                IN THE WILD // REAL PATRONS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-zinc-100 uppercase tracking-wide mt-1">
                Collector Testimonials
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-400 max-w-xs sm:text-right">
              Styled organically by jewelry patrons across Mumbai, Delhi, and Bengaluru.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTOR_TESTIMONIALS.map((test) => (
              <div
                key={test.id}
                className="bg-[#0A0A0D] border border-zinc-800/80 overflow-hidden flex flex-col justify-between group hover:border-[#D4AF37]/40 transition-colors"
              >
                <div className="relative aspect-square w-full bg-zinc-900 overflow-hidden">
                  <ArtisticImage
                    src={test.image}
                    alt={`${test.patron} wearing AURA`}
                    fill
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2 py-0.5 text-[8px] font-mono text-emerald-400 border border-emerald-800">
                    VERIFIED PATRON
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="font-serif italic text-xs text-zinc-300 leading-relaxed">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                  <div className="pt-2 border-t border-zinc-900 text-[10px] font-mono">
                    <div className="flex justify-between items-baseline">
                      <span className="text-zinc-200 font-bold">{test.patron}</span>
                      <span className="text-zinc-500">{test.location}</span>
                    </div>
                    <span className="text-[#D4AF37] text-[9px] block mt-0.5">
                      Acquired: {test.productName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
    </div>
  );
}
