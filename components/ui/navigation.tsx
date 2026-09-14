'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export function Navigation() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Indian Trust & Announcement Strip (Palmonas Style) */}
      <div className="bg-[#0A0A0C] text-zinc-400 border-b border-zinc-900 py-2 px-6 text-[10px] tracking-[0.25em] font-mono uppercase flex justify-between items-center select-none">
        <div className="flex items-center gap-3">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-[#D4AF37]">MUMBAI — DELHI — BENGALURU</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-zinc-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> BIS HALLMARKED 925 SILVER
          </span>
          <span className="text-zinc-600">|</span>
          <span>LIFETIME ANTI-TARNISH WARRANTY</span>
          <span className="text-zinc-600">|</span>
          <span className="text-emerald-400 font-semibold">COD & FREE EXPRESS SHIPPING</span>
        </div>
        <span className="text-zinc-400">
          EXTRA 5% OFF ON UPI <span className="text-[#D4AF37]">CODE: AURAUPI</span>
        </span>
      </div>

      {/* Main Editorial Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-[#09090B]/95 backdrop-blur-md border-b border-zinc-800/80 py-3.5 shadow-2xl'
            : 'bg-[#09090B] border-b border-zinc-800/40 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Left Navigation Links */}
          <nav className="hidden md:flex items-center space-x-9 text-xs font-mono tracking-[0.22em] uppercase">
            <Link
              href="/atelier"
              className={`transition-colors hover:text-[#D4AF37] ${
                pathname === '/atelier' ? 'text-[#D4AF37]' : 'text-zinc-400'
              }`}
            >
              The Atelier
            </Link>
            <Link
              href="/#curated-gallery"
              className="text-zinc-400 hover:text-[#D4AF37] transition-colors"
            >
              Curated Gallery
            </Link>
            <Link
              href="/#warranty"
              className="text-zinc-400 hover:text-[#D4AF37] transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Anti-Tarnish Promise</span>
            </Link>
            <Link
              href="/orders"
              className={`transition-colors hover:text-[#D4AF37] flex items-center gap-1.5 ${
                pathname === '/orders' ? 'text-[#D4AF37]' : 'text-zinc-400'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Track Orders</span>
            </Link>
          </nav>

          {/* Center Brand Identity */}
          <Link href="/" className="group text-center">
            <span className="block font-serif text-2xl md:text-3xl tracking-[0.35em] uppercase text-zinc-100 font-normal transition-transform duration-500 group-hover:scale-102">
              A U R A
            </span>
            <span className="block text-[8px] font-mono tracking-[0.4em] uppercase text-[#D4AF37] -mt-0.5">
              FINE JEWELLERY ATELIER • INDIA
            </span>
          </Link>

          {/* Right Controls: Currency, Cart & Mobile Toggle */}
          <div className="flex items-center space-x-6">
            <span className="hidden sm:inline text-[10px] font-mono tracking-widest text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
              INR ₹
            </span>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 text-zinc-300 hover:text-[#D4AF37] transition-colors group relative"
              aria-label="Open Collection Cart"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              <span className="hidden sm:inline font-mono text-xs tracking-[0.2em] uppercase text-zinc-400 group-hover:text-[#D4AF37]">
                Bag
              </span>
              <span className="font-mono text-xs bg-[#D4AF37] text-zinc-950 font-bold px-2 py-0.5 rounded-full transition-colors">
                {itemCount}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-zinc-400 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0A0A0C] border-b border-zinc-800 px-6 py-8 space-y-6 animate-fadeIn">
            <nav className="flex flex-col space-y-5 text-sm font-mono tracking-[0.25em] uppercase">
              <Link
                href="/atelier"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-[#D4AF37]"
              >
                The Atelier (Shop All)
              </Link>
              <Link
                href="/#curated-gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-[#D4AF37]"
              >
                Curated Gallery
              </Link>
              <Link
                href="/#warranty"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-[#D4AF37]"
              >
                Lifetime Anti-Tarnish Warranty
              </Link>
              <Link
                href="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-[#D4AF37] flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>Track Orders</span>
              </Link>
              <Link
                href="/checkout"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#D4AF37] hover:underline"
              >
                Checkout (COD & UPI Available)
              </Link>
            </nav>
            <div className="pt-4 border-t border-zinc-800 text-xs font-mono text-zinc-500 space-y-1">
              <p>📍 Shipped directly from Mumbai & Jaipur Hubs</p>
              <p>🚚 Delivery in 2-4 days via Blue Dart / Delhivery</p>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navigation;
