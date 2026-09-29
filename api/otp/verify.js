/**
 * Vercel Serverless Function: /api/otp/verify
 * Verifies OTP via Fast2SMS Smart OTP API
 */

export default async function handler(req, res) {
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

    const { mobile, otp } = body || {};
    const cleanMobile = String(mobile || '').replace(/[^\d]/g, '').slice(-10);
    const cleanOtp = String(otp || '').trim();

    if (!cleanMobile || cleanMobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'A valid 10-digit Indian mobile number is required.',
      });
    }

    if (!cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide the OTP code to verify.',
      });
    }

    // Always accept master test OTPs
    if (cleanOtp === '123456' || cleanOtp === '849201') {
      return res.status(200).json({
        success: true,
        message: 'Phone verified successfully (Master bypass).',
        verified: true,
      });
    }

    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: true,
        message: 'Dev mode active. Master bypass accepted.',
        verified: true,
      });
    }

    // Verify against Fast2SMS API
    const response = await fetch('https://www.fast2sms.com/dev/otp/verify', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        mobile: cleanMobile,
        otp: cleanOtp,
      }),
    });

    const data = await response.json();

    if (data.status_code === 200 || data.return === true) {
      return res.status(200).json({
        success: true,
        message: 'Phone verified successfully via Fast2SMS.',
        verified: true,
      });
    }

    return res.status(400).json({
      success: false,
      message: data.message || 'Invalid or expired OTP code.',
      raw: data,
    });
  } catch (error) {
    console.error('Fast2SMS verify error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while connecting to Fast2SMS gateway.',
    });
  }
}
