'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus, ShieldCheck } from 'lucide-react';
import type { Product } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { ArtisticImage } from '@/components/ui/artistic-image';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

export function ProductCard({ product, index = 0, priority = false }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: (index % 4) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative cursor-pointer block"
    >
      <Link href={`/atelier/${product.slug}`} className="block relative">
        {/* Raw Artwork Frame */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0D0D10]">
          {/* Top Left: BIS Hallmark Trust Tag */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-1.5">
            <span className="text-[9px] font-mono tracking-wider uppercase text-zinc-300 bg-black/70 backdrop-blur-md px-2.5 py-1 border border-zinc-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
              {product.hallmark ? 'BIS 925' : `SPECIMEN // 00${index + 1}`}
            </span>
          </div>

          {/* Top Right: Discount Badge */}
          {discount && (
            <div className="absolute top-4 right-4 z-20 pointer-events-none">
              <span className="text-[9px] font-mono tracking-wider uppercase text-emerald-400 bg-emerald-950/80 backdrop-blur-md px-2 py-0.5 border border-emerald-800 font-semibold">
                {discount}% OFF
              </span>
            </div>
          )}

          {/* Artistic Image with editorial filter */}
          <ArtisticImage
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            className="w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105"
            exhibitNumber={`PIECE // 00${index + 1}`}
            materialTag={product.material}
          />

          {/* Hover Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-50 group-hover:opacity-95 transition-opacity duration-500" />

          {/* Details & Pricing */}
          <div className="absolute bottom-0 inset-x-0 p-6 z-20 transform translate-y-3 group-hover:translate-y-0 opacity-95 group-hover:opacity-100 transition-all duration-500 ease-out">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
                {product.categoryName}
              </span>
              <div className="flex items-baseline gap-2">
                {product.originalPrice && (
                  <span className="text-[11px] font-mono text-zinc-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="font-mono text-sm tracking-wider text-zinc-100 font-semibold text-emerald-300">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            <h3 className="font-serif text-xl md:text-2xl text-zinc-100 tracking-wide leading-tight group-hover:text-white">
              {product.name}
            </h3>

            <p className="text-[11px] font-mono text-zinc-400 mt-1 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
              {product.material}
            </p>

            {/* Quick Action Buttons on Hover */}
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-400 flex items-center gap-1 hover:text-white">
                View Specimen <ArrowUpRight className="w-3.5 h-3.5" />
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#c5a059] text-zinc-950 text-[10px] font-mono tracking-widest uppercase font-bold transition-all flex items-center gap-1.5 shadow-md"
                aria-label={`Add ${product.name} to Collection`}
              >
                <Plus className="w-3 h-3" /> Add to Bag
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProductCard;
