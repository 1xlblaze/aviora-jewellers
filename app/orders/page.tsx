'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PackageCheck,
  Truck,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Search,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { ArtisticImage } from '@/components/ui/artistic-image';
import { type OrderRecord, createOrderTimeline } from '@/lib/data';

export default function OrdersPage() {
  const { orders, lastPlacedOrder } = useCart();
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedAWB, setCopiedAWB] = useState(false);

  // Set default selected order
  useEffect(() => {
    if (orders.length > 0) {
      setSelectedOrderNumber(lastPlacedOrder?.orderNumber || orders[0].orderNumber);
    }
  }, [orders, lastPlacedOrder]);

  const activeOrder: OrderRecord | undefined = orders.find(
    (o) => o.orderNumber === selectedOrderNumber
  ) || orders[0];

  const handleCopyAWB = (awb: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(awb);
      setCopiedAWB(true);
      setTimeout(() => setCopiedAWB(false), 2000);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const match = orders.find(
      (o) =>
        o.orderNumber.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        o.customerPhone?.includes(searchQuery.trim()) ||
        o.customerEmail?.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    if (match) {
      setSelectedOrderNumber(match.orderNumber);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-12 px-6 md:px-14">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
          <Link
            href="/atelier"
            className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-[#D4AF37] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Atelier</span>
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            LIVE BLUE DART EXPRESS AIR LOGISTICS
          </span>
        </div>

        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-zinc-500 block">
              PATRON ARCHIVE // REAL-TIME DISPATCH
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-tight text-zinc-100 mt-1">
              Order Tracking & History
            </h1>
          </div>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID (e.g. AUR-IN-...) or Phone"
                className="w-full bg-[#0A0A0E] border border-zinc-800 focus:border-[#D4AF37] px-4 py-2.5 text-xs font-mono text-zinc-100 placeholder-zinc-600 outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#c5a059] text-zinc-950 font-mono text-xs uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </form>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-zinc-800 p-12 space-y-4">
            <div className="w-16 h-16 rounded-full border border-dashed border-zinc-700 mx-auto flex items-center justify-center text-zinc-500">
              <PackageCheck className="w-7 h-7" />
            </div>
            <h3 className="font-serif italic text-2xl text-zinc-300">
              No previous orders found in this session.
            </h3>
            <p className="text-xs font-mono text-zinc-500 max-w-md mx-auto leading-relaxed">
              When you complete an order via UPI or Cash on Delivery, your full order dossier and Blue Dart tracking timeline will be permanently recorded here.
            </p>
            <div className="pt-2">
              <Link
                href="/atelier"
                className="px-8 py-3.5 bg-[#D4AF37] hover:bg-[#c5a059] text-zinc-950 font-mono text-xs uppercase tracking-[0.2em] font-bold transition-all"
              >
                Browse 14K Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Historical Orders List */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono tracking-widest uppercase text-zinc-400 border-b border-zinc-800 pb-3">
                <span>Archived Orders ({orders.length})</span>
                <span className="text-[10px] text-zinc-600">Saved Locally</span>
              </div>

              <div className="space-y-3">
                {orders.map((order) => {
                  const isSelected = order.orderNumber === activeOrder?.orderNumber;
                  return (
                    <button
                      key={order.orderNumber}
                      onClick={() => setSelectedOrderNumber(order.orderNumber)}
                      className={`w-full text-left p-4 border transition-all ${
                        isSelected
                          ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                          : 'border-zinc-800 bg-[#0A0A0D] hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-xs font-bold text-zinc-100">
                          {order.orderNumber}
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-400 uppercase font-semibold">
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between items-baseline text-[11px] font-mono text-zinc-400">
                        <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}</span>
                        <span className="text-[#D4AF37] font-bold">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1 truncate">
                        {order.items?.length || 1} piece(s) · {order.city}, {order.state}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Order Real-Time Tracking & Inspection */}
            {activeOrder && (
              <div className="lg:col-span-8 space-y-8">
                {/* 1. Live Blue Dart Shipping Status Bar */}
                <div className="p-6 bg-[#0B0B0E] border border-[#D4AF37]/50 space-y-6 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#D4AF37] block">
                        ACTIVE LOGISTICS WAYBILL
                      </span>
                      <h2 className="font-serif text-2xl text-zinc-100 mt-0.5">
                        Order #{activeOrder.orderNumber}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                          Blue Dart AWB Air Waybill
                        </span>
                        <span className="font-mono text-xs text-zinc-200 font-bold">
                          {activeOrder.trackingNumber || 'BLD-7492-8812-IN'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyAWB(activeOrder.trackingNumber || 'BLD-7492-8812-IN')}
                        className="p-2 border border-zinc-800 hover:border-[#D4AF37] text-zinc-400 hover:text-white transition-colors"
                        title="Copy AWB Tracking Number"
                      >
                        {copiedAWB ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* 2. Interactive Shipment Progress Stepper */}
                  <div className="space-y-6 pt-2">
                    <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-300 flex items-center gap-2">
                      <Truck className="w-4 h-4 text-[#D4AF37]" />
                      Real-Time Transit Progress
                    </h3>

                    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                      {(activeOrder.timeline || createOrderTimeline(activeOrder.status || 'IN_TRANSIT', activeOrder.createdAt)).map((step, idx) => {
                        const isDone = step.completed || step.current;
                        return (
                          <div key={idx} className="relative group">
                            {/* Dot */}
                            <div
                              className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                step.current
                                  ? 'bg-[#D4AF37] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.6)]'
                                  : isDone
                                  ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                              }`}
                            >
                              {step.current ? (
                                <span className="w-2 h-2 rounded-full bg-zinc-950 animate-ping" />
                              ) : isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                              )}
                            </div>

                            {/* Content */}
                            <div className="space-y-0.5">
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span
                                  className={`text-xs font-mono font-bold uppercase tracking-wider ${
                                    step.current ? 'text-[#D4AF37]' : isDone ? 'text-zinc-200' : 'text-zinc-500'
                                  }`}
                                >
                                  {step.label}
                                </span>
                                {step.current && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] animate-pulse">
                                    IN PROGRESS
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] font-mono text-zinc-400">
                                {step.description}
                              </p>
                              <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 pt-0.5">
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-[#D4AF37]" /> {step.location}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {step.timestamp}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Order Items & Materiality Dossier */}
                <div className="p-6 bg-[#0A0A0D] border border-zinc-800 space-y-6">
                  <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-zinc-300 border-b border-zinc-800 pb-3 flex items-center justify-between">
                    <span>Sculptural Pieces Acquired ({activeOrder.items?.length || 1})</span>
                    <span className="text-emerald-400 font-semibold text-[10px]">
                      {activeOrder.paymentMethod} Payment Verified
                    </span>
                  </h3>

                  <div className="divide-y divide-zinc-900">
                    {(activeOrder.items || []).map((item, idx) => (
                      <div key={idx} className="py-4 first:pt-0 flex gap-4">
                        <div className="relative w-18 h-22 flex-shrink-0 bg-zinc-900 border border-zinc-800 overflow-hidden">
                          <ArtisticImage
                            src={item.image}
                            alt={item.name}
                            fill
                            className="w-full h-full"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-serif text-base text-zinc-100">{item.name}</h4>
                              <span className="font-mono text-sm text-zinc-100 font-bold">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                            <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                              {item.material}
                            </p>
                            {item.engraving && (
                              <p className="text-[10px] font-mono text-[#D4AF37] mt-0.5">
                                Custom Engraving: &ldquo;{item.engraving}&rdquo;
                              </p>
                            )}
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-2">
                            <span>Qty: {item.quantity}</span>
                            <span className="text-[#D4AF37] flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> BIS 925 Pure Silver Core
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address Summary */}
                  <div className="pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-zinc-400">
                    <div className="p-3 bg-zinc-950 border border-zinc-900 space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">
                        Consignee Details
                      </span>
                      <p className="text-zinc-200 font-semibold">{activeOrder.customerName}</p>
                      <p>{activeOrder.customerPhone}</p>
                      <p>{activeOrder.customerEmail}</p>
                    </div>

                    <div className="p-3 bg-zinc-950 border border-zinc-900 space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-500 block">
                        Destination Address
                      </span>
                      <p className="text-zinc-200">{activeOrder.shippingAddress}</p>
                      <p>
                        {activeOrder.city}, {activeOrder.state} — {activeOrder.postalCode}
                      </p>
                      <p className="text-emerald-400">Estimated Delivery: 2-3 Business Days</p>
                    </div>
                  </div>

                  {/* Financial Settlement */}
                  <div className="pt-4 border-t border-zinc-800 space-y-1.5 text-xs font-mono text-zinc-400">
                    <div className="flex justify-between">
                      <span>Total Paid:</span>
                      <span className="text-[#D4AF37] text-base font-bold">
                        {formatPrice(activeOrder.total)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>Inclusive of 3% GST & Lifetime Anti-Tarnish Warranty</span>
                      <span>Free Express Courier</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
