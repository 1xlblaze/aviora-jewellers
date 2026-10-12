/**
 * Vercel Serverless Function: /api/telemetry/log
 * Logs auth & payment telemetry hits into Vercel runtime logs
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

    const { event = 'TELEMETRY_EVENT', details = {}, timestamp = new Date().toISOString() } = body || {};
    
    // Log directly into Vercel runtime functions console
    console.info(`[A SILVER CHAPTER TELEMETRY] [${timestamp}] ${event}:`, JSON.stringify(details));

    return res.status(200).json({ success: true, logged: true });
  } catch (err) {
    console.error('[A SILVER CHAPTER TELEMETRY] Error logging telemetry hit:', err);
    return res.status(200).json({ success: true });
  }
}
