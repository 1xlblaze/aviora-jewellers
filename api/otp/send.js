/**
 * Vercel Serverless Function: /api/otp/send
 * Sends OTP via Fast2SMS Smart OTP API
 */

export default async function handler(req, res) {
  // Set CORS headers
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

    const { mobile, otpId } = body || {};
    const cleanMobile = String(mobile || '').replace(/[^\d]/g, '').slice(-10);

    if (!cleanMobile || cleanMobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'A valid 10-digit Indian mobile number is required.',
      });
    }

    const apiKey = process.env.FAST2SMS_API_KEY;
    const activeOtpId = otpId || process.env.FAST2SMS_OTP_ID;

    if (!apiKey) {
      return res.status(200).json({
        success: true,
        mode: 'sandbox',
        message: 'Fast2SMS API key pending. Use master test OTP: 123456 or 849201.',
      });
    }

    // Check if OTP ID is configured
    if (!activeOtpId) {
      return res.status(200).json({
        success: true,
        mode: 'sandbox',
        message: 'Fast2SMS OTP_ID not yet configured. Use master test OTP: 123456 or 849201.',
        note: 'Please provide your OTP Template ID from https://www.fast2sms.com/dashboard/otp to enable live telecom SMS.',
      });
    }

    // Call Fast2SMS Smart OTP send API
    const response = await fetch('https://www.fast2sms.com/dev/otp/send', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        mobile: cleanMobile,
        otp_id: activeOtpId,
        otp_expiry: 10,
        otp_length: 6,
      }),
    });

    const data = await response.json();

    if (data.status_code === 200 || data.return === true) {
      return res.status(200).json({
        success: true,
        mode: 'live',
        message: 'OTP sent successfully to +91 ' + cleanMobile,
        requestId: data.request_id,
      });
    }

    // Fast2SMS verification / KYC requirement notice
    if (data.status_code === 996) {
      return res.status(200).json({
        success: true,
        mode: 'sandbox',
        message: 'Fast2SMS website/KYC verification pending on dashboard. Use test code 123456.',
        rawError: data.message,
      });
    }

    return res.status(400).json({
      success: false,
      message: Array.isArray(data.message) ? data.message.join(', ') : (data.message || 'Failed to dispatch SMS OTP'),
      raw: data,
    });
  } catch (error) {
    console.error('Fast2SMS send error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while connecting to Fast2SMS gateway.',
    });
  }
}
