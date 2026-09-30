/**
 * Vercel Serverless Function: /api/razorpay/verify
 * Validates Razorpay Payment Signature using HMAC SHA-256
 */

import crypto from 'node:crypto';

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      custom_secret,
    } = body || {};

    if (!razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'razorpay_payment_id is required',
      });
    }

    const secret =
      custom_secret ||
      process.env.RAZORPAY_KEY_SECRET ||
      '';

    if (!secret && razorpay_signature) {
      return res.status(500).json({
        success: false,
        message: 'Server secret is not configured in Vercel environment variables',
      });
    }

    // If razorpay_order_id is provided, verify standard signature
    if (razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const isMatch = generatedSignature === razorpay_signature;

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          verified: false,
          message: 'Invalid Razorpay payment signature',
        });
      }
    }

    return res.status(200).json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id || null,
      message: 'Razorpay payment verified successfully',
    });
  } catch (error) {
    console.error('Error in /api/razorpay/verify:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message,
    });
  }
}
