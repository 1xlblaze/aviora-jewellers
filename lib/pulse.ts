/**
 * AVIORA JEWELLERS — Customer Drop-off & Funnel Pulse Telemetry
 * Powered by PostHog Web SDK & Session Replay
 */

import posthog from 'posthog-js';

const env = typeof import.meta !== 'undefined' && (import.meta as any).env ? (import.meta as any).env : {};

const POSTHOG_KEY =
  env.VITE_POSTHOG_KEY ||
  (typeof process !== 'undefined' && (process.env?.VITE_POSTHOG_KEY || process.env?.NEXT_PUBLIC_POSTHOG_KEY || process.env?.POSTHOG_API_KEY)) ||
  'phc_uGse6iV36oVVLZXPtHkwXYuUEn9T9pGeWJTnJXfiBUxm';

const POSTHOG_HOST =
  env.VITE_POSTHOG_HOST ||
  (typeof process !== 'undefined' && (process.env?.VITE_POSTHOG_HOST || process.env?.NEXT_PUBLIC_POSTHOG_HOST || process.env?.POSTHOG_HOST)) ||
  'https://us.i.posthog.com';

let isInitialized = false;

export function initPulse() {
  if (typeof window === 'undefined' || isInitialized) return;
  if (!POSTHOG_KEY) {
    if (env.DEV) {
      console.info('[Pulse] VITE_POSTHOG_KEY not set in environment. Telemetry idle.');
    }
    return;
  }

  try {
    const isClient = typeof window !== 'undefined';

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      ui_host: 'https://us.posthog.com',
      person_profiles: 'always',
      autocapture: true,
      capture_pageview: 'history_change',
      capture_pageleave: true,
      persistence: 'localStorage+cookie',
      cross_subdomain_cookie: true,
      secure_cookie: isClient && window.location.protocol === 'https:',
      enable_recording_console_log: true,
      logs: {
        captureConsoleLogs: true,
        serviceName: 'aviora-jewellers-web',
      },
      session_recording: {
        maskAllInputs: false,
        maskInputOptions: {
          password: true,
        },
      },
      loaded: (ph) => {
        isInitialized = true;
        try {
          ph.capture('store_loaded', {
            path: window.location.pathname,
            referrer: document.referrer || '',
            url: window.location.href,
            timestamp: new Date().toISOString(),
          });
        } catch {}
      },
    });
    isInitialized = true;
  } catch (err) {
    console.warn('[Pulse] Failed to initialize PostHog tracker:', err);
  }
}


// Auto-initialize on browser load
if (typeof window !== 'undefined') {
  initPulse();
}

/**
 * Funnel Pulse API: Explicit tracking of customer journey milestones & drop-offs
 */
export const pulse = {
  /**
   * Identify customer by phone/email once known
   */
  identify(distinctId: string, traits: Record<string, any> = {}) {
    try {
      if (typeof window !== 'undefined') {
        const cleanDigits = (distinctId || '').replace(/[^\d]/g, '');
        const normalizedId = cleanDigits.length >= 10 ? `+91${cleanDigits.slice(-10)}` : distinctId;
        const profileProperties = {
          ...traits,
          ...(cleanDigits.length >= 10 ? { $phone: normalizedId, phone: normalizedId } : {}),
        };
        posthog.identify(normalizedId, profileProperties);
      }
    } catch {}
  },

  /**
   * Track Product Detail View
   */
  productViewed(product: { id?: string | number; name: string; price: number; category?: string }) {
    try {
      posthog.capture('product_viewed', {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        category: product.category,
        timestamp: new Date().toISOString(),
      });
    } catch {}
  },

  /**
   * Track Add To Cart
   */
  addedToCart(item: { id?: string | number; name: string; price: number; quantity?: number }, cartTotal?: number) {
    try {
      posthog.capture('cart_item_added', {
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        cart_total: cartTotal,
      });
    } catch {}
  },

  /**
   * Track Cart Drawer opened
   */
  cartDrawerOpened(itemCount: number, cartTotal: number) {
    try {
      posthog.capture('cart_drawer_opened', {
        item_count: itemCount,
        cart_total: cartTotal,
      });
    } catch {}
  },

  /**
   * Track Checkout Modal / Page Opened
   */
  checkoutStarted(cartItems: any[], totalAmount: number) {
    try {
      posthog.capture('checkout_started', {
        items_count: cartItems.length,
        total_amount: totalAmount,
        currency: 'INR',
      });
    } catch {}
  },

  /**
   * Track Customer Phone / Shipping Details entered
   */
  contactSubmitted(phone: string, pincode?: string, city?: string) {
    try {
      posthog.capture('checkout_contact_entered', {
        phone: phone ? `+91${phone.replace(/[^\d]/g, '').slice(-10)}` : '',
        pincode,
        city,
      });
    } catch {}
  },

  /**
   * Track OTP Sent to Customer
   */
  otpRequested(phone: string, mode: 'live' | 'sandbox' | 'firebase' = 'live') {
    try {
      posthog.capture('otp_dispatched', {
        phone: phone ? `+91${phone.replace(/[^\d]/g, '').slice(-10)}` : '',
        gateway_mode: mode,
      });
    } catch {}
  },

  /**
   * Track OTP Successfully Verified
   */
  otpVerified(phone: string) {
    try {
      posthog.capture('otp_verified_success', {
        phone: phone ? `+91${phone.replace(/[^\d]/g, '').slice(-10)}` : '',
      });
    } catch {}
  },

  /**
   * Track Razorpay Standard Checkout SDK popup opened
   */
  razorpayModalOpened(orderId: string, amount: number) {
    try {
      posthog.capture('razorpay_modal_opened', {
        razorpay_order_id: orderId,
        amount_paise: amount,
        gateway: 'Razorpay Standard Checkout',
      });
    } catch {}
  },

  /**
   * CRITICAL DROP-OFF METRIC: Customer closed Razorpay popup without completing payment
   */
  razorpayModalDismissed(orderId?: string, context?: Record<string, any>) {
    try {
      posthog.capture('razorpay_payment_dismissed_dropoff', {
        razorpay_order_id: orderId,
        reason: 'User closed payment window before authorization',
        ...context,
      });
    } catch {}
  },

  /**
   * CRITICAL DROP-OFF METRIC: Payment failed at bank/UPI gateway
   */
  razorpayPaymentFailed(orderId: string, error: { code?: string; description?: string; source?: string; step?: string }) {
    try {
      posthog.capture('razorpay_payment_failed', {
        razorpay_order_id: orderId,
        error_code: error.code,
        error_description: error.description,
        error_source: error.source,
        error_step: error.step,
      });
    } catch {}
  },

  /**
   * Track Final Order Success
   */
  orderCompleted(order: { id: string; amount: number; paymentId?: string; paymentMethod?: string }) {
    try {
      posthog.capture('order_completed_success', {
        order_id: order.id,
        amount: order.amount,
        payment_id: order.paymentId,
        payment_method: order.paymentMethod || 'Razorpay UPI',
      });
    } catch {}
  },

  /**
   * Generic custom event pulse
   */
  custom(eventName: string, properties: Record<string, any> = {}) {
    try {
      posthog.capture(eventName, properties);
    } catch {}
  },
};

export default pulse;
