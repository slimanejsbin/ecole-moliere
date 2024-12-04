import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

interface LoggerConfig {
    environment: string;
    release: string;
    sampleRate: number;
    debug?: boolean;
}

class Logger {
    private static instance: Logger;
    private initialized: boolean = false;
    private environment: string;

    private constructor() {
        this.environment = import.meta.env.VITE_APP_ENV || 'development';
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    public initialize(config: LoggerConfig) {
        if (this.initialized) return;

        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN,
            integrations: [new Integrations.BrowserTracing()],
            environment: config.environment,
            release: config.release,
            tracesSampleRate: config.sampleRate,
            debug: config.debug,
        });

        this.initialized = true;
    }

    public setUser(user: { id: string; email: string; role: string }) {
        Sentry.setUser(user);
    }

    public clearUser() {
        Sentry.setUser(null);
    }

    public error(error: Error, context?: Record<string, any>) {
        console.error(error);
        
        if (this.environment === 'production') {
            Sentry.captureException(error, {
                extra: context,
            });
        }
    }

    public warn(message: string, context?: Record<string, any>) {
        console.warn(message);
        
        if (this.environment === 'production') {
            Sentry.captureMessage(message, {
                level: 'warning',
                extra: context,
            });
        }
    }

    public info(message: string, context?: Record<string, any>) {
        console.info(message);
        
        if (this.environment === 'production') {
            Sentry.addBreadcrumb({
                category: 'info',
                message,
                level: 'info',
                data: context,
            });
        }
    }

    public startTransaction(name: string, op: string) {
        return Sentry.startTransaction({ name, op });
    }

    public setTag(key: string, value: string) {
        Sentry.setTag(key, value);
    }

    public capturePerformanceMetric(metric: {
        name: string;
        value: number;
        unit: string;
    }) {
        if (this.environment === 'production') {
            Sentry.captureMessage('Performance Metric', {
                level: 'info',
                extra: metric,
            });
        }
    }
}

export const logger = Logger.getInstance();
