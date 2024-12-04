import { logger } from './logger';

export class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private metrics: Map<string, number[]> = new Map();

    private constructor() {
        this.initializeObservers();
    }

    public static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    private initializeObservers() {
        // Web Vitals Observer
        if ('web-vitals' in window) {
            import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
                getCLS(this.handleCLS.bind(this));
                getFID(this.handleFID.bind(this));
                getLCP(this.handleLCP.bind(this));
            });
        }

        // Performance Observer
        if ('PerformanceObserver' in window) {
            const paintObserver = new PerformanceObserver((entries) => {
                entries.getEntries().forEach((entry) => {
                    logger.capturePerformanceMetric({
                        name: entry.name,
                        value: entry.startTime,
                        unit: 'ms',
                    });
                });
            });

            paintObserver.observe({ entryTypes: ['paint'] });
        }
    }

    private handleCLS({ value }: { value: number }) {
        this.recordMetric('CLS', value);
    }

    private handleFID({ value }: { value: number }) {
        this.recordMetric('FID', value);
    }

    private handleLCP({ value }: { value: number }) {
        this.recordMetric('LCP', value);
    }

    public recordMetric(name: string, value: number) {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }
        this.metrics.get(name)?.push(value);

        logger.capturePerformanceMetric({
            name,
            value,
            unit: this.getMetricUnit(name),
        });
    }

    private getMetricUnit(metricName: string): string {
        switch (metricName) {
            case 'CLS':
                return 'unitless';
            case 'FID':
            case 'LCP':
            case 'TTFB':
                return 'ms';
            default:
                return 'unknown';
        }
    }

    public getMetricAverage(name: string): number | null {
        const values = this.metrics.get(name);
        if (!values || values.length === 0) return null;

        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    }

    public getMetricPercentile(name: string, percentile: number): number | null {
        const values = this.metrics.get(name);
        if (!values || values.length === 0) return null;

        const sorted = [...values].sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[index];
    }

    public getAllMetrics() {
        const metrics: Record<string, { 
            average: number | null;
            p75: number | null;
            p95: number | null;
            latest: number | null;
        }> = {};

        this.metrics.forEach((values, name) => {
            metrics[name] = {
                average: this.getMetricAverage(name),
                p75: this.getMetricPercentile(name, 75),
                p95: this.getMetricPercentile(name, 95),
                latest: values[values.length - 1] || null,
            };
        });

        return metrics;
    }

    public clearMetrics() {
        this.metrics.clear();
    }
}

export const performanceMonitor = PerformanceMonitor.getInstance();
