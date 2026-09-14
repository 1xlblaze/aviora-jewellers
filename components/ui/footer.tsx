'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#070708] text-zinc-400 border-t border-zinc-800/80 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 pb-16 border-b border-zinc-900">
          {/* Brand Philosophy */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl tracking-[0.3em] uppercase text-zinc-100 block">
                A U R A
              </span>
              <span className="text-[9px] font-mono tracking-[0.4em] uppercase text-[#D4AF37] block mt-0.5">
                HAUTE JOAILLERIE SCULPTURALE
              </span>
            </Link>
            <p className="text-xs font-mono text-zinc-500 leading-relaxed max-w-sm">
              Wearable architectural sculptures crafted at the intersection of brutalist geometry, ancient metallurgy, and raw cosmic mineralogy.
            </p>
            <div className="text-[10px] font-mono text-zinc-600 space-y-1">
              <p>SALON PRIVÉ: 14 PLACE VENDÔME, PARIS</p>
              <p>STUDIO: SOHO, NEW YORK // GINZA, TOKYO</p>
            </div>
          </div>

          {/* Exhibition Disciplines */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-[0.25em] uppercase text-zinc-200">
              Disciplines
            </h4>
            <ul className="space-y-2.5 text-xs font-mono text-zinc-500">
              <li>
                <Link href="/atelier" className="hover:text-[#D4AF37] transition-colors">
                  Anatomical Cuffs
                </Link>
              </li>
              <li>
                <Link href="/atelier" className="hover:text-[#D4AF37] transition-colors">
                  Sculptural Rings
                </Link>
              </li>
              <li>
                <Link href="/atelier" className="hover:text-[#D4AF37] transition-colors">
                  Orbital Torques & Chokers
                </Link>
              </li>
              <li>
                <Link href="/atelier" className="hover:text-[#D4AF37] transition-colors">
                  Negative Space Adornments
                </Link>
              </li>
              <li>
                <Link href="/atelier" className="hover:text-[#D4AF37] transition-colors">
                  Unique Commission Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Archival Protocols */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-[0.25em] uppercase text-zinc-200">
              Protocols & Care
            </h4>
            <ul className="space-y-2.5 text-xs font-mono text-zinc-500">
              <li>
                <span className="hover:text-zinc-300 cursor-pointer transition-colors">
                  Armored Courier Logistics
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-300 cursor-pointer transition-colors">
                  Authenticity & Archival Passports
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-300 cursor-pointer transition-colors">
                  Meteorite & Precious Metal Care
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-300 cursor-pointer transition-colors">
                  Lifetime Restoration Guarantee
                </span>
              </li>
              <li>
                <span className="hover:text-zinc-300 cursor-pointer transition-colors">
                  Ethical Metallurgy Traceability
                </span>
              </li>
            </ul>
          </div>

          {/* Private Salon Invitation */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-[0.25em] uppercase text-zinc-200">
              The Inner Vault
            </h4>
            <p className="text-xs font-mono text-zinc-500 leading-relaxed">
              Receive confidential invitations to unpublished casting releases and vernissages.
            </p>
            <div className="flex border-b border-zinc-700 pb-2 focus-within:border-[#D4AF37] transition-colors">
              <input
                type="email"
                placeholder="collector@domain.com"
                className="bg-transparent border-none outline-none text-xs font-mono w-full text-zinc-200 placeholder-zinc-600"
              />
              <button className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#D4AF37] font-semibold hover:text-white transition-colors">
                Enlist
              </button>
            </div>
            <p className="text-[9px] font-mono text-zinc-600">
              Limited to 500 patrons per calendar cycle.
            </p>
          </div>
        </div>

        {/* Bottom Colophon */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-zinc-600 space-y-4 md:space-y-0">
          <div>
            © {new Date().getFullYear()} AURA ATELIER DE SCULPTURE. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-8">
            <span className="hover:text-zinc-400 cursor-pointer">PRIVACY PROTOCOL</span>
            <span className="hover:text-zinc-400 cursor-pointer">TERMS OF ACQUISITION</span>
            <span className="hover:text-zinc-400 cursor-pointer">VERIFICATION API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
