import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { SeverityNumber } from '@opentelemetry/api-logs';

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY || '';
const POSTHOG_LOGS_URL = process.env.POSTHOG_LOGS_URL || 'https://us.i.posthog.com/i/v1/logs';
const SERVICE_NAME = process.env.OTEL_SERVICE_NAME || 'aviora-jewellers-api';

let exporter = null;
let loggerProvider = null;
let otelLoggerInstance = null;

if (POSTHOG_API_KEY) {
  try {
    exporter = new OTLPLogExporter({
      url: POSTHOG_LOGS_URL,
      headers: {
        Authorization: `Bearer ${POSTHOG_API_KEY}`,
      },
    });

    loggerProvider = new LoggerProvider({
      resource: resourceFromAttributes({
        'service.name': SERVICE_NAME,
        'deployment.environment': process.env.NODE_ENV || 'production',
      }),
      processors: [new SimpleLogRecordProcessor({ exporter })],
    });

    otelLoggerInstance = loggerProvider.getLogger(SERVICE_NAME);
  } catch (initErr) {
    console.warn('[OpenTelemetry] Logger initialization warning:', initErr.message);
  }
}

export const otelLogger = otelLoggerInstance;

let pendingCaptures = [];

function captureToPostHogApi(message, severity, attributes = {}) {
  if (!POSTHOG_API_KEY) return;
  try {
    const eventName = attributes['telemetry.event'] || attributes['event.name'] || 'api_log';
    const distinctId = attributes.customerPhone || attributes.orderId || attributes.requestId || 'serverless_api';
    const p = fetch('https://us.i.posthog.com/capture/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_API_KEY,
        event: eventName,
        properties: {
          distinct_id: distinctId,
          log_message: message,
          log_severity: severity,
          timestamp: new Date().toISOString(),
          ...attributes,
        },
      }),
    }).catch(() => {});
    pendingCaptures.push(p);
  } catch {}
}

/**
 * Flush pending logs before serverless function exits
 */
export async function flushLogs() {
  const promises = [];
  if (loggerProvider) {
    promises.push(loggerProvider.forceFlush().catch(() => {}));
  }
  if (pendingCaptures.length > 0) {
    promises.push(Promise.allSettled(pendingCaptures));
    pendingCaptures = [];
  }
  await Promise.allSettled(promises);
}

/**
 * Log structured INFO event to PostHog
 */
export function logInfo(message, attributes = {}) {
  if (!POSTHOG_API_KEY) {
    console.warn('[PostHog] POSTHOG_API_KEY is missing in Vercel Environment Variables. Log skipped:', message);
    return;
  }
  captureToPostHogApi(message, 'INFO', attributes);
  if (otelLogger) {
    try {
      otelLogger.emit({
        severityNumber: SeverityNumber.INFO,
        severityText: 'INFO',
        body: message,
        attributes: {
          timestamp: new Date().toISOString(),
          ...attributes,
        },
      });
    } catch (err) {
      console.error('[Logger] logInfo error:', err);
    }
  }
}

/**
 * Log structured WARN event to PostHog
 */
export function logWarn(message, attributes = {}) {
  if (!POSTHOG_API_KEY) {
    console.warn('[PostHog] POSTHOG_API_KEY is missing in Vercel Environment Variables. Log skipped:', message);
    return;
  }
  captureToPostHogApi(message, 'WARN', attributes);
  if (otelLogger) {
    try {
      otelLogger.emit({
        severityNumber: SeverityNumber.WARN,
        severityText: 'WARN',
        body: message,
        attributes: {
          timestamp: new Date().toISOString(),
          ...attributes,
        },
      });
    } catch (err) {
      console.error('[Logger] logWarn error:', err);
    }
  }
}

/**
 * Log structured ERROR event to PostHog
 */
export function logError(message, error = null, attributes = {}) {
  if (!POSTHOG_API_KEY) {
    console.warn('[PostHog] POSTHOG_API_KEY is missing in Vercel Environment Variables. Log skipped:', message);
    return;
  }
  const errorAttrs = error instanceof Error ? {
    'error.name': error.name,
    'error.message': error.message,
    'error.stack': error.stack,
  } : (error ? { 'error.raw': typeof error === 'object' ? JSON.stringify(error) : String(error) } : {});

  const mergedAttrs = { ...errorAttrs, ...attributes };
  captureToPostHogApi(message, 'ERROR', mergedAttrs);

  if (otelLogger) {
    try {
      otelLogger.emit({
        severityNumber: SeverityNumber.ERROR,
        severityText: 'ERROR',
        body: message,
        attributes: {
          timestamp: new Date().toISOString(),
          ...mergedAttrs,
        },
      });
    } catch (err) {
      console.error('[Logger] logError error:', err);
    }
  }
}

export default otelLogger;

