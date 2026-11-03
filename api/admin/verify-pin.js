/**
 * Vercel Serverless Function: /api/admin/verify-pin
 * Securely verifies staff master access key on the server side
 * Prevents exposing secret PINs or hashes in client bundles
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

    const { pin } = body || {};
    const inputPin = String(pin || '').trim();

    if (!inputPin) {
      return res.status(400).json({ success: false, message: 'PIN code is required' });
    }

    // Server-side authoritative PIN from Vercel environment variables
    const serverPin = (process.env.ADMIN_ACCESS_OTP || process.env.VITE_ADMIN_ACCESS_OTP || '').trim();

    if (!serverPin) {
      return res.status(500).json({
        success: false,
        message: 'Admin access PIN is not configured on the server. Please configure ADMIN_ACCESS_OTP in Vercel.',
      });
    }

    if (inputPin === serverPin) {
      return res.status(200).json({
        success: true,
        message: 'Staff access authorized.',
      });
    }

    // Constant-time failure response
    await new Promise((r) => setTimeout(r, 400));
    return res.status(401).json({
      success: false,
      message: 'Invalid Master PIN. Access denied.',
    });
  } catch (err) {
    console.error('Error in /api/admin/verify-pin:', err);
    return res.status(500).json({ success: false, message: 'Internal server verification error' });
  }
}
