// Centralized error logging and handling
type ErrorContext = {
  [key: string]: unknown;
};

type ErrorLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  private formatMessage(level: ErrorLevel, context: string, error: unknown) {
    const timestamp = new Date().toISOString();
    const errorMsg = error instanceof Error ? error.message : String(error);
    return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${errorMsg}`;
  }

  private logToConsole(level: ErrorLevel, message: string) {
    const logFn = {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
      fatal: console.error,
    }[level];

    logFn(message);
  }

  private async logToService(level: ErrorLevel, context: string, error: unknown, metadata?: ErrorContext) {
    // In production, send to error tracking service (Sentry, LogRocket, etc.)
    if (!this.isDev && process.env.NEXT_PUBLIC_ERROR_TRACKING_ENABLED === 'true') {
      try {
        await fetch('/api/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            level,
            context,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            metadata,
            timestamp: new Date().toISOString(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          }),
        });
      } catch (err) {
        console.error('Failed to log to service:', err);
      }
    }
  }

  debug(context: string, error: unknown, metadata?: ErrorContext) {
    const message = this.formatMessage('debug', context, error);
    this.logToConsole('debug', message);
  }

  info(context: string, message: string, metadata?: ErrorContext) {
    const formatted = `[${new Date().toISOString()}] [INFO] [${context}] ${message}`;
    this.logToConsole('info', formatted);
  }

  warn(context: string, error: unknown, metadata?: ErrorContext) {
    const message = this.formatMessage('warn', context, error);
    this.logToConsole('warn', message);
    this.logToService('warn', context, error, metadata);
  }

  error(context: string, error: unknown, metadata?: ErrorContext) {
    const message = this.formatMessage('error', context, error);
    this.logToConsole('error', message);
    this.logToService('error', context, error, metadata);
  }

  fatal(context: string, error: unknown, metadata?: ErrorContext) {
    const message = this.formatMessage('fatal', context, error);
    this.logToConsole('fatal', message);
    this.logToService('fatal', context, error, metadata);
  }
}

export const logger = new Logger();

// Error recovery utilities
export function createErrorMessage(context: string, error: unknown): string {
  if (error instanceof Error) {
    return `${context}: ${error.message}`;
  }
  return `${context}: ${String(error)}`;
}

export async function withErrorBoundary<T>(
  fn: () => Promise<T>,
  context: string,
  fallback: T
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logger.error(context, error);
    return fallback;
  }
}

export function withSync<T>(
  fn: () => T,
  context: string,
  fallback: T
): T {
  try {
    return fn();
  } catch (error) {
    logger.error(context, error);
    return fallback;
  }
}
