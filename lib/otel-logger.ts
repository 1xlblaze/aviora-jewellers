/**
 * PostHog OpenTelemetry Logger Bridge
 * Provides structured OTLP logging to PostHog for API actions and serverless functions
 */

export { otelLogger, flushLogs, logInfo, logWarn, logError } from '../api/_logger.js';
