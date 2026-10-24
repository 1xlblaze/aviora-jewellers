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

/**
 * Flush pending logs before serverless function exits
 */
export async function flushLogs() {
  if (loggerProvider) {
    try {
      await loggerProvider.forceFlush();
    } catch (err) {
      console.error('[OpenTelemetry] Error flushing logs to PostHog:', err);
    }
  }
}


/**
 * Log structured INFO event to PostHog
 */
export function logInfo(message, attributes = {}) {
  if (!otelLogger) return;
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

/**
 * Log structured WARN event to PostHog
 */
export function logWarn(message, attributes = {}) {
  if (!otelLogger) return;
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

/**
 * Log structured ERROR event to PostHog
 */
export function logError(message, error = null, attributes = {}) {
  if (!otelLogger) return;
  try {
    const errorAttrs = error instanceof Error ? {
      'error.name': error.name,
      'error.message': error.message,
      'error.stack': error.stack,
    } : (error ? { 'error.raw': typeof error === 'object' ? JSON.stringify(error) : String(error) } : {});

    otelLogger.emit({
      severityNumber: SeverityNumber.ERROR,
      severityText: 'ERROR',
      body: message,
      attributes: {
        timestamp: new Date().toISOString(),
        ...errorAttrs,
        ...attributes,
      },
    });
  } catch (err) {
    console.error('[Logger] logError error:', err);
  }
}


export default otelLogger;
