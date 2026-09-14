'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { PRODUCTS, type Product } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { ArtisticImage } from './artistic-image';

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, addToCart, cartTotal, itemCount, orders } = useCart();
  const FREE_SHIPPING_THRESHOLD = 1999;
  const progressToFreeShipping = Math.min(100, (cartTotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Identify Upsell Recommendation (PRD Requirement D)
  const upsellProduct: Product | undefined = React.useMemo(() => {
    if (cart.length === 0) return undefined;
    // Look for first item in cart that has pairsWithId not yet in cart
    for (const item of cart) {
      if (item.product.pairsWithId) {
        const candidate = PRODUCTS.find((p) => p.id === item.product.pairsWithId);
        const alreadyInCart = cart.some((c) => c.product.id === candidate?.id);
        if (candidate && !alreadyInCart) return candidate;
      }
    }
    // Fallback: pick any product not yet in cart
    return PRODUCTS.find((p) => !cart.some((c) => c.product.id === p.id));
  }, [cart]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0A0A0C] text-zinc-100 border-l border-zinc-800/70 shadow-2xl z-[90] flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-5 border-b border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-[0.3em] font-mono uppercase text-[#D4AF37] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  CURATED SHOPPING BAG
                </span>
                <h2 className="font-serif text-2xl tracking-wide text-zinc-100 mt-0.5">
                  Your Collection ({itemCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-zinc-900 transition-colors text-zinc-400 hover:text-white"
                aria-label="Close Cart Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Delivery Gamification Meter (PRD Requirement D) */}
            <div className="bg-zinc-950 px-8 py-3 border-b border-zinc-900 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-zinc-300">
                {cartTotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Unlocked: FREE Express Pan-India Delivery!
                  </span>
                ) : (
                  <span>
                    You are <strong>{formatPrice(FREE_SHIPPING_THRESHOLD - cartTotal)}</strong> away from Free Express Delivery
                  </span>
                )}
                <span className="text-zinc-500 font-bold">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-8 py-5 space-y-5 divide-y divide-zinc-900">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
                  <div className="w-16 h-16 rounded-full border border-dashed border-zinc-800 flex items-center justify-center text-zinc-600">
                    <span className="font-mono text-xs">00</span>
                  </div>
                  <p className="font-serif italic text-lg text-zinc-400">
                    Your collection bag is empty.
                  </p>
                  <p className="text-xs text-zinc-600 max-w-xs leading-relaxed font-mono uppercase tracking-wider">
                    Explore our 14k champagne gold and BIS hallmarked pure silver sculptures.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5 mt-4">
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="px-6 py-2.5 text-xs font-mono tracking-[0.2em] uppercase border border-zinc-800 hover:border-[#D4AF37] text-zinc-300 hover:text-[#D4AF37] transition-all"
                    >
                      Enter Atelier
                    </button>
                    {orders.length > 0 && (
                      <Link
                        href="/orders"
                        onClick={() => setIsCartOpen(false)}
                        className="px-6 py-2.5 text-xs font-mono tracking-[0.2em] uppercase bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Track Orders ({orders.length})</span>
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                cart.map(({ product, quantity, engraving }) => (
                  <div key={product.id} className="pt-5 first:pt-0 flex gap-4">
                    <div className="relative w-18 h-22 flex-shrink-0 bg-zinc-900 overflow-hidden border border-zinc-800">
                      <ArtisticImage
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="w-full h-full"
                        exhibitNumber="14K"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[9px] font-mono uppercase tracking-widest text-[#D4AF37]">
                              {product.goldPurity || '14K Gold'}
                            </span>
                            <h4 className="font-serif text-base text-zinc-100 leading-snug">
                              {product.name}
                            </h4>
                          </div>
                          <span className="font-mono text-sm text-zinc-100 font-bold">
                            {formatPrice(product.price * quantity)}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5 line-clamp-1">
                          {product.material}
                        </p>
                        {engraving && (
                          <p className="text-[10px] font-mono text-[#D4AF37] mt-0.5">
                            Engraving: &ldquo;{engraving}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-zinc-900 text-xs">
                        <div className="flex items-center border border-zinc-800 rounded bg-zinc-900/40">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="p-1 text-zinc-400 hover:text-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 font-mono text-xs text-zinc-200">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="p-1 text-zinc-400 hover:text-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 hover:text-rose-400 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {/* In-Drawer Upsell Module (PRD Requirement D) */}
              {upsellProduct && cart.length > 0 && (
                <div className="pt-5 mt-4 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      Pairs beautifully with...
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">14K SET UPSELL</span>
                  </div>

                  <div className="p-3 bg-zinc-950 border border-zinc-800/80 flex items-center gap-3.5 group hover:border-[#D4AF37]/50 transition-colors">
                    <div className="relative w-14 h-16 flex-shrink-0 bg-zinc-900 overflow-hidden border border-zinc-800">
                      <ArtisticImage
                        src={upsellProduct.images[0]}
                        alt={upsellProduct.name}
                        fill
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif text-xs text-zinc-100 truncate group-hover:text-[#D4AF37] transition-colors">
                        {upsellProduct.name}
                      </h5>
                      <p className="text-[10px] font-mono text-zinc-400">
                        {formatPrice(upsellProduct.price)}{' '}
                        {upsellProduct.originalPrice && (
                          <span className="line-through text-zinc-600 text-[9px]">
                            {formatPrice(upsellProduct.originalPrice)}
                          </span>
                        )}
                      </p>
                      <p className="text-[9px] font-mono text-zinc-500 truncate">
                        {upsellProduct.colorTone}
                      </p>
                    </div>
                    <button
                      onClick={() => addToCart(upsellProduct, 1)}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-[#D4AF37] hover:text-zinc-950 text-zinc-200 text-[10px] font-mono uppercase tracking-wider font-bold border border-zinc-700 hover:border-[#D4AF37] transition-all flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Acquisition CTA */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-zinc-800/80 bg-zinc-950 space-y-3.5">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-zinc-400 border-b border-zinc-900 pb-2.5">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Blue Dart Express
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> 14K Lifetime Warranty
                  </span>
                  <span className="text-emerald-400 font-semibold">COD Available</span>
                </div>

                <div className="flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400 block">
                      Subtotal
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      Includes 3% GST & Insured Packaging
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl text-zinc-100 font-bold">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-4 bg-[#D4AF37] hover:bg-[#c5a059] text-zinc-950 font-mono text-xs tracking-[0.25em] uppercase font-bold flex items-center justify-center gap-3 transition-all duration-300 group shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                >
                  <span>Proceed to Checkout (COD / UPI)</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                {orders.length > 0 && (
                  <div className="pt-2 text-center">
                    <Link
                      href="/orders"
                      onClick={() => setIsCartOpen(false)}
                      className="text-[10px] font-mono tracking-wider uppercase text-zinc-400 hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1.5"
                    >
                      <Truck className="w-3 h-3 text-[#D4AF37]" />
                      <span>Track Previous Acquisitions ({orders.length}) →</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
