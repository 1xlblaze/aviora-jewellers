/**
 * Vercel Serverless Function: /api/telemetry/log
 * Emits auth, checkout & payment telemetry hits into PostHog OTLP logs
 */

import { logInfo, logError, flushLogs } from '../_logger.js';

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

    // 1. Emit to PostHog OpenTelemetry Logger
    logInfo(`[TELEMETRY] ${event}`, {
      'telemetry.event': event,
      'telemetry.timestamp': timestamp,
      ...details,
    });

    // 2. Fallback console print for Vercel runtime logs
    console.info(`[A SILVER CHAPTER TELEMETRY] [${timestamp}] ${event}:`, JSON.stringify(details));

    // Ensure OTLP payload is sent before serverless function exits
    await flushLogs();

    return res.status(200).json({ success: true, logged: true });
  } catch (err) {
    console.error('[A SILVER CHAPTER TELEMETRY] Error logging telemetry hit:', err);
    logError('Failed processing telemetry hit', err);
    await flushLogs();
    return res.status(200).json({ success: true });
  }
}

