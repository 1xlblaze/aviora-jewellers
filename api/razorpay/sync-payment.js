/**
 * Vercel Serverless Function: /api/razorpay/sync-payment
 * Fetches authoritative payment/link details from Razorpay, synchronizes with Supabase,
 * and returns the verified order and customer profile.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kqolyvmwcsqilnakuewt.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxb2x5dm13Y3NxaWxuYWt1ZXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MDA3OTEsImV4cCI6MjA5Mjk3Njc5MX0.S55kkJmt7temy86iOarGf4bo-AwgUew-5tEzSj_0lw4';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = {};
    if (req.method === 'POST') {
      body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    }
    const query = req.query || {};

    const paymentId = query.razorpay_payment_id || query.payment_id || body.razorpay_payment_id || body.paymentId;
    const paymentLinkId = query.razorpay_payment_link_id || query.link_id || body.razorpay_payment_link_id || body.paymentLinkId;
    const orderId = query.razorpay_order_id || query.order_id || body.razorpay_order_id || body.orderId;
    const clientOrder = body.pendingOrder || null;

    if (!paymentId && !paymentLinkId && !orderId) {
      return res.status(400).json({ success: false, message: 'payment_id or payment_link_id or order_id is required' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || '';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    let paymentData = null;
    let linkData = null;

    // 1. Fetch Payment details from Razorpay if paymentId provided
    if (paymentId) {
      try {
        const pRes = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
          headers: { 'Authorization': authHeader }
        });
        if (pRes.ok) {
          paymentData = await pRes.json();
        }
      } catch (e) {
        console.warn('Error fetching payment from Razorpay:', e);
      }
    }

    // 2. Fetch Payment Link details if paymentLinkId provided
    if (paymentLinkId) {
      try {
        const lRes = await fetch(`https://api.razorpay.com/v1/payment_links/${paymentLinkId}`, {
          headers: { 'Authorization': authHeader }
        });
        if (lRes.ok) {
          linkData = await lRes.json();
          if (!paymentData && linkData.payments && linkData.payments.length > 0) {
            const firstP = linkData.payments[0];
            const pRes = await fetch(`https://api.razorpay.com/v1/payments/${firstP.payment_id}`, {
              headers: { 'Authorization': authHeader }
            });
            if (pRes.ok) paymentData = await pRes.json();
          }
        }
      } catch (e) {
        console.warn('Error fetching payment link from Razorpay:', e);
      }
    }

    // Determine payment success
    const isCaptured = (paymentData && (paymentData.status === 'captured' || paymentData.status === 'authorized')) ||
                       (linkData && linkData.status === 'paid');

    if (!isCaptured && !paymentData) {
      return res.status(404).json({ success: false, message: 'Payment record not found or unconfirmed.' });
    }

    // Resolve customer phone & name
    const rawPhone = paymentData?.contact || linkData?.customer?.contact || clientOrder?.formData?.customerPhone || '';
    const cleanPhone = rawPhone.replace(/[^\d]/g, '').slice(-10);
    const customerName = paymentData?.notes?.customerName || linkData?.customer?.name || clientOrder?.formData?.customerName || 'Customer';
    const customerEmail = paymentData?.email || linkData?.customer?.email || clientOrder?.formData?.customerEmail || 'asilverchaptersupport@gmail.com';
    const shippingAddress = paymentData?.notes?.shippingAddress || clientOrder?.formData?.shippingAddress || '';

    // Resolve order number (e.g. AVR-IN-297896)
    let orderNumber = paymentData?.notes?.orderNumber || '';
    if (!orderNumber && linkData?.description) {
      const match = linkData.description.match(/#([A-Z0-9-]+)/i);
      if (match) orderNumber = match[1];
    }
    if (!orderNumber && clientOrder?.orderNumber) {
      orderNumber = clientOrder.orderNumber;
    }
    if (!orderNumber) {
      orderNumber = `AVR-IN-${Math.floor(100000 + Math.random() * 900000)}`;
    }

    // Check if order already exists in Supabase aviora_orders
    const { data: existingRows } = await supabase
      .from('aviora_orders')
      .select('*')
      .or(`order_number.eq.${orderNumber},payment_transaction_id.eq.${paymentId || ''}`);

    if (existingRows && existingRows.length > 0) {
      const existing = existingRows[0];
      return res.status(200).json({
        success: true,
        order: existing,
        customerPhone: cleanPhone || existing.customer_phone,
        customerName: customerName || existing.customer_name,
        alreadyExisted: true,
      });
    }

    // Otherwise construct and persist new order
    const amountInPaise = paymentData?.amount || linkData?.amount || (clientOrder?.finalTotal ? clientOrder.finalTotal * 100 : 100);
    const grossTotal = Math.round(amountInPaise / 100);
    const gstAmount = Math.round((grossTotal * 3) / 103);

    const items = (clientOrder?.cart && clientOrder.cart.length > 0)
      ? clientOrder.cart.map(item => ({
          productId: item.product?.id || item.productId,
          name: item.product?.name || item.name,
          price: item.product?.price || item.price,
          quantity: item.quantity,
          image: item.product?.images?.[0] || item.image || '/products/moissanite-tennis-bracelet-3mm-9450-1.jpg',
          material: item.product?.material || 'Fine 925 Sterling Silver',
          hallmark: 'Fine 925 Sterling Silver',
        }))
      : [
          {
            productId: 'prod-008',
            name: 'Moissanite Tennis Bracelet 3mm (7 Inch)',
            price: grossTotal,
            quantity: 1,
            image: '/products/moissanite-tennis-bracelet-3mm-9450-1.jpg',
            material: '3mm VVS Moissanite & Fine 925 Sterling Silver',
            hallmark: 'Fine 925 Silver & Moissanite',
          }
        ];

    const orderDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const nowIso = new Date().toISOString();

    const timeline = [
      {
        status: 'CONFIRMED',
        label: 'Payment Confirmed & Order Accepted',
        location: 'Atelier Vault, Delhi',
        description: 'Payment verified via secure gateway callback. Made-to-order benchwork queue initiated.',
        timestamp: nowIso,
        completed: true,
        current: false,
      },
      {
        status: 'PREPARING',
        label: 'Preparing & Handcrafting in Studio',
        location: 'Foundry & Bench, Delhi Atelier',
        description: 'Master artisans casting and hand-forging piece in Fine 925 Sterling Silver (15–20 business days).',
        timestamp: nowIso,
        completed: false,
        current: true,
      },
      {
        status: 'SHIPPED',
        label: 'Shipped via Blue Dart Express Air',
        location: 'Delhi Air Cargo Hub',
        description: 'Consignment number will be assigned upon dispatch & courier handover to Blue Dart Express Air.',
        timestamp: 'Pending',
        completed: false,
        current: false,
      },
      {
        status: 'OUT_FOR_DELIVERY',
        label: 'Out for Doorstep Handover',
        location: 'Local Delivery Hub',
        description: 'Blue Dart courier associate out for doorstep delivery with customer OTP verification.',
        timestamp: 'Pending',
        completed: false,
        current: false,
      },
      {
        status: 'DELIVERED',
        label: 'Delivered to Customer',
        location: 'Destination Address',
        description: 'Package delivered safely. 30-Day Manufacturing Warranty is now active.',
        timestamp: 'Pending',
        completed: false,
        current: false,
      }
    ];

    const orderRow = {
      order_number: orderNumber,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: cleanPhone,
      shipping_address: shippingAddress || 'Studio Vault Delivery, Pratap Vihar, Ghaziabad',
      city: clientOrder?.formData?.city || 'Ghaziabad',
      state: clientOrder?.formData?.state || 'Uttar Pradesh',
      postal_code: clientOrder?.formData?.postalCode || '201009',
      country: 'India',
      payment_method: 'Razorpay',
      subtotal: grossTotal,
      discount: clientOrder?.upiDiscount || 0,
      total: grossTotal,
      currency: 'INR',
      status: 'CONFIRMED',
      courier: 'Blue Dart Express Air',
      tracking_number: '',
      bluedart_consignment_no: '',
      gst_amount: gstAmount,
      estimated_delivery: '15-20 Business Days Handcrafting + 1-5 Days Express Air',
      items,
      timeline,
      otp_verified: true,
      payment_transaction_id: paymentId || '',
      whatsapp_notifications: [],
      metadata: {
        razorpay_order_id: orderId || paymentData?.order_id || '',
        razorpay_payment_id: paymentId || '',
        razorpay_amount_in_paise: amountInPaise,
        bank_rrn: paymentData?.acquirer_data?.rrn || '',
        vpa: paymentData?.vpa || '',
        payment_link_id: paymentLinkId || '',
      }
    };

    const { data: inserted, error: insertErr } = await supabase.from('aviora_orders').upsert([orderRow], { onConflict: 'order_number' }).select();

    if (insertErr) {
      console.error('Supabase insert error in sync-payment:', insertErr);
    }

    return res.status(200).json({
      success: true,
      order: inserted?.[0] || orderRow,
      customerPhone: cleanPhone,
      customerName,
      created: true,
    });
  } catch (error) {
    console.error('Error in /api/razorpay/sync-payment:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
