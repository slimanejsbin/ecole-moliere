// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Throttle utility
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Memoization utility
export const memoize = <T extends (...args: any[]) => any>(
    func: T
): ((...args: Parameters<T>) => ReturnType<T>) => {
    const cache = new Map<string, ReturnType<T>>();

    return (...args: Parameters<T>) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key)!;
        }
        const result = func(...args);
        cache.set(key, result);
        return result;
    };
};

// Intersection Observer utility for lazy loading
export const createIntersectionObserver = (
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {}
): IntersectionObserver | null => {
    if (!('IntersectionObserver' in window)) return null;
    return new IntersectionObserver(callback, options);
};

// Resource preloading
export const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = src;
    });
};

// Chunk array for pagination
export const chunkArray = <T>(array: T[], size: number): T[][] => {
    const chunked: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }
    return chunked;
};

// Performance monitoring
export const measurePerformance = async (
    callback: () => Promise<any>,
    label: string
): Promise<any> => {
    const start = performance.now();
    try {
        const result = await callback();
        const end = performance.now();
        console.log(`${label} took ${end - start}ms`);
        return result;
    } catch (error) {
        const end = performance.now();
        console.error(`${label} failed after ${end - start}ms`, error);
        throw error;
    }
};

// Request idle callback utility
export const scheduleIdleTask = (
    callback: () => void,
    timeout?: number
): number => {
    if ('requestIdleCallback' in window) {
        return window.requestIdleCallback(callback, { timeout });
    }
    return window.setTimeout(callback, 0);
};

// Cancel idle task
export const cancelIdleTask = (id: number): void => {
    if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(id);
    } else {
        window.clearTimeout(id);
    }
};
