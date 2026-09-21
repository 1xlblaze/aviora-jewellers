'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  Lock,
  Sparkles,
  Smartphone,
  CreditCard,
  Banknote,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { INDIAN_STATES, type OrderRecord, createOrderTimeline } from '@/lib/data';
import { ArtisticImage } from '@/components/ui/artistic-image';

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, addOrder } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'COD' | 'NETBANKING'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // 5% discount on UPI
  const upiDiscount = paymentMethod === 'UPI' ? Math.round(cartTotal * 0.05) : 0;
  const finalTotal = cartTotal - upiDiscount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your shopping bag is empty.');
      return;
    }

    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone || !formData.shippingAddress || !formData.city || !formData.postalCode) {
      setErrorMessage('Please fill in all shipping details.');
      return;
    }

    if (!/^\d{6}$/.test(formData.postalCode.trim())) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    if (!/^\d{10}$/.test(formData.customerPhone.replace(/\D/g, ''))) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = `AUR-IN-${Math.floor(100000 + Math.random() * 900000)}`;
      const trackingNumber = `BLD-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-IN`;

      const orderRecord: OrderRecord = {
        id: orderNumber,
        orderNumber,
        createdAt: new Date().toISOString(),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        shippingAddress: formData.shippingAddress,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: 'India',
        paymentMethod,
        subtotal: cartTotal,
        discount: upiDiscount,
        total: finalTotal,
        currency: 'INR',
        status: 'IN_TRANSIT',
        courier: 'Blue Dart Express Air',
        trackingNumber,
        estimatedDelivery: '2-3 Business Days',
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          originalPrice: item.product.originalPrice,
          quantity: item.quantity,
          image: item.product.images[0],
          material: item.product.material,
          engraving: item.engraving,
          hallmark: item.product.hallmark,
        })),
        timeline: createOrderTimeline('IN_TRANSIT', new Date().toISOString()),
      };

      // 1. Permanently save to orders history archive
      addOrder(orderRecord);
      setCompletedOrder(orderRecord);
      clearCart();
    } catch (err) {
      console.warn('Checkout error:', err);
      setErrorMessage('Failed to finalize order. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================================
  // ORDER CONFIRMATION VIEW
  // =========================================================================
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#070709] text-zinc-100 py-16 px-6 md:px-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full bg-[#0A0A0E] border border-[#D4AF37]/50 p-8 md:p-14 shadow-[0_0_50px_rgba(212,175,55,0.15)] space-y-8 relative overflow-hidden"
        >
          <div className="text-center space-y-3 border-b border-zinc-800 pb-8">
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-[#D4AF37] block">
              BIS CERTIFIED ORDER CONFIRMED
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-zinc-100 uppercase tracking-wide">
              Thank You for Your Order!
            </h1>
            <p className="font-mono text-xs text-zinc-400">
              Order Reference:{' '}
              <span className="text-[#D4AF37] font-semibold">{completedOrder.orderNumber}</span>
            </p>
          </div>

          <div className="space-y-4 text-xs font-mono text-zinc-300">
            <div className="p-4 bg-zinc-950 border border-zinc-800/80 space-y-2.5">
              <div className="flex justify-between text-zinc-400">
                <span>Customer:</span>
                <span className="text-zinc-100 font-medium">{completedOrder.customerName}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Contact Phone:</span>
                <span className="text-zinc-100 font-medium">{completedOrder.customerPhone || 'Provided'}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Shipping Destination:</span>
                <span className="text-zinc-100 font-medium">
                  {completedOrder.city}, {completedOrder.state} — {completedOrder.postalCode}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Payment Mode:</span>
                <span className="text-emerald-400 font-semibold">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-900">
                <span>Final Order Amount:</span>
                <span className="text-[#D4AF37] text-base font-bold">
                  {formatPrice(completedOrder.total || finalTotal)}
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>
                Your order is being hallmarked and packed at our Mumbai atelier. You will receive WhatsApp tracking updates via Blue Dart Express.
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/orders"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#D4AF37] hover:bg-[#c5a059] text-zinc-950 font-mono text-xs tracking-[0.2em] uppercase font-bold transition-all text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            >
              <Truck className="w-4 h-4" />
              <span>Track Shipment Live ({completedOrder.trackingNumber || 'Blue Dart'})</span>
            </Link>
            <Link
              href="/atelier"
              className="w-full sm:w-auto px-8 py-3.5 border border-zinc-700 hover:border-zinc-400 text-zinc-300 font-mono text-xs tracking-[0.2em] uppercase font-bold transition-all text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // =========================================================================
  // INDIAN CHECKOUT VIEW
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 py-8 sm:py-12 px-4 sm:px-6 md:px-14 safe-area-bottom">
      <div className="max-w-6xl mx-auto space-y-10">
        <Link
          href="/atelier"
          className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-zinc-400 hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Atelier</span>
        </Link>

        <div className="border-b border-zinc-800 pb-6">
          <span className="text-[10px] font-mono tracking-[0.35em] uppercase text-[#D4AF37] block">
            SECURE ENCRYPTED CHECKOUT
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-tight text-zinc-100 mt-1">
            Express Checkout
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-zinc-800 p-12 space-y-4">
            <p className="font-serif italic text-2xl text-zinc-400">
              Your bag is currently empty.
            </p>
            <Link
              href="/atelier"
              className="inline-block mt-4 px-6 py-3 border border-[#D4AF37] text-xs font-mono tracking-widest uppercase text-[#D4AF37] hover:bg-[#D4AF37] hover:text-zinc-950 transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Indian Shipping & Payment Details */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8">
              {errorMessage && (
                <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono">
                  {errorMessage}
                </div>
              )}

              {/* 1. Customer Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-zinc-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  01 // Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      name="customerName"
                      autoComplete="name"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="e.g. Ananya Sharma"
                      className="w-full bg-[#0D0D10] border border-zinc-800 focus:border-[#D4AF37] px-4 py-3 text-xs font-mono text-zinc-100 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Email for Invoice & Certificate
                    </label>
                    <input
                      required
                      type="email"
                      name="customerEmail"
                      inputMode="email"
                      autoComplete="email"
                      value={formData.customerEmail}
                      onChange={handleInputChange}
                      placeholder="ananya@gmail.com"
                      className="w-full bg-[#0D0D10] border border-zinc-800 focus:border-[#D4AF37] px-4 py-3 text-xs font-mono text-zinc-100 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    Mobile Number (For WhatsApp Delivery Updates & OTP)
                  </label>
                  <div className="flex">
                    <span className="px-3.5 py-3 bg-zinc-900 border border-r-0 border-zinc-800 text-xs font-mono text-zinc-400">
                      +91
                    </span>
                    <input
                      required
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      maxLength={10}
                      name="customerPhone"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className="flex-1 bg-[#0D0D10] border border-zinc-800 focus:border-[#D4AF37] px-4 py-3 text-xs font-mono text-zinc-100 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Indian Shipping Address */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-zinc-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  02 // Delivery Address
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                      Flat / House No. / Building / Street
                    </label>
                    <input
                      required
                      type="text"
                      name="shippingAddress"
                      autoComplete="street-address"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      placeholder="Apartment 402, Sea Green Apts, Worli"
                      className="w-full bg-[#0D0D10] border border-zinc-800 focus:border-[#D4AF37] px-4 py-3 text-xs font-mono text-zinc-100 outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        PIN Code (6 Digits)
                      </label>
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="postal-code"
                        maxLength={6}
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="400018"
                        className="w-full bg-[#0D0D10] border border-zinc-800 focus:border-[#D4AF37] px-4 py-3 text-xs font-mono text-zinc-100 outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        City
                      </label>
                      <input
                        required
                        type="text"
                        name="city"
                        autoComplete="address-level2"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className="w-full bg-[#0D0D10] border border-zinc-800 focus:border-[#D4AF37] px-4 py-3 text-xs font-mono text-zinc-100 outline-none transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        State
                      </label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full bg-[#0D0D10] border border-zinc-800 focus:border-[#D4AF37] px-4 py-3 text-xs font-mono text-zinc-100 outline-none transition-colors cursor-pointer"
                      >
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Payment Method: UPI, COD, Card, NetBanking */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-zinc-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    03 // Payment Method
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400">
                    ⚡ Instant 5% off on UPI
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-4 border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#D4AF37] mb-2" />
                    <div>
                      <span className="text-xs font-mono font-bold block">UPI / GPay</span>
                      <span className="text-[9px] font-mono text-emerald-400">Save 5%</span>
                    </div>
                  </button>

                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-emerald-400 mb-2" />
                    <div>
                      <span className="text-xs font-mono font-bold block">Cash on Delivery</span>
                      <span className="text-[9px] font-mono text-zinc-500">Pay at Doorstep</span>
                    </div>
                  </button>

                  {/* Cards */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-4 border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'CARD'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#D4AF37] mb-2" />
                    <div>
                      <span className="text-xs font-mono font-bold block">Cards / RuPay</span>
                      <span className="text-[9px] font-mono text-zinc-500">Credit & Debit</span>
                    </div>
                  </button>

                  {/* NetBanking */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`p-4 border text-left flex flex-col justify-between transition-all ${
                      paymentMethod === 'NETBANKING'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-white shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-[#D4AF37] mb-2" />
                    <div>
                      <span className="text-xs font-mono font-bold block">NetBanking</span>
                      <span className="text-[9px] font-mono text-zinc-500">All Indian Banks</span>
                    </div>
                  </button>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="p-4 bg-zinc-950 border border-zinc-800/80 space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Enter UPI ID / VPA (e.g. mobile@okhdfcbank, user@paytm)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. ananya@okaxis"
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#D4AF37] px-3.5 py-2.5 text-xs font-mono text-zinc-100 outline-none"
                    />
                    <p className="text-[10px] font-mono text-emerald-400">
                      ✓ Instant 5% Pre-paid discount of {formatPrice(upiDiscount)} applied!
                    </p>
                  </div>
                )}

                {paymentMethod === 'COD' && (
                  <div className="p-4 bg-zinc-950 border border-zinc-800/80 text-xs font-mono text-zinc-400 leading-relaxed">
                    <p className="text-zinc-200 font-semibold mb-1">
                      Cash on Delivery (COD) Selected
                    </p>
                    <p>
                      You will pay directly in cash or via mobile UPI QR code to the Blue Dart delivery agent when your hallmarked jewelry package arrives at your door.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6 border-t border-zinc-800 space-y-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-[#D4AF37] hover:bg-[#c5a059] disabled:bg-zinc-800 text-zinc-950 font-mono text-xs tracking-[0.25em] uppercase font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_30px_rgba(212,175,55,0.25)]"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'CONFIRMING ORDER WITH ATELIER...'
                      : paymentMethod === 'COD'
                      ? `Confirm Cash on Delivery Order — ${formatPrice(finalTotal)}`
                      : `Pay & Place Order — ${formatPrice(finalTotal)}`}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-zinc-500 tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> BIS Hallmarked Guarantee
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Insured Blue Dart Courier
                  </span>
                </div>
              </div>
            </form>

            {/* Right Summary: Collection Dossier */}
            <div className="lg:col-span-5 p-8 bg-[#0C0C0E] border border-zinc-800 space-y-6">
              <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-zinc-300 border-b border-zinc-800 pb-4">
                Bag Summary ({cart.length} Pieces)
              </h3>

              <div className="space-y-4 max-h-[360px] overflow-y-auto divide-y divide-zinc-900 pr-2">
                {cart.map(({ product, quantity }) => (
                  <div key={product.id} className="pt-4 first:pt-0 flex gap-4">
                    <div className="relative w-16 h-20 flex-shrink-0 bg-zinc-900 overflow-hidden border border-zinc-800">
                      <ArtisticImage
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-sm text-zinc-100">{product.name}</h4>
                        <p className="text-[10px] font-mono text-[#D4AF37] mt-0.5">
                          {product.hallmark || 'BIS 925'} · Qty: {quantity}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-zinc-100 font-bold">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2 border-t border-zinc-800 pt-4 text-xs font-mono text-zinc-400">
                <div className="flex justify-between">
                  <span>Bag Total (MRP):</span>
                  <span className="text-zinc-200">{formatPrice(cartTotal)}</span>
                </div>
                {paymentMethod === 'UPI' && upiDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>UPI Prepaid Discount (5%):</span>
                    <span>- {formatPrice(upiDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Express Delivery:</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Keepsake Packaging:</span>
                  <span className="text-zinc-200">INCLUDED</span>
                </div>
                <div className="flex justify-between items-baseline pt-4 border-t border-zinc-800 text-sm font-serif text-zinc-100">
                  <span className="uppercase font-mono text-xs tracking-widest">Total Payable</span>
                  <span className="text-2xl font-mono text-[#D4AF37] font-bold">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
